// Load local env vars when running server.js directly
try { require('dotenv').config({ path: '.env.local' }) } catch (e) {}

const next = require('next')
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { PrismaClient } = require('@prisma/client')
const { parse } = require('cookie')
const { getToken } = require('next-auth/jwt')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const prisma = new PrismaClient()

app.prepare().then(() => {
  const server = express()
  const httpServer = http.createServer(server)
  const allowedOrigin = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const io = new Server(httpServer, { cors: { origin: allowedOrigin, credentials: true } })
    // expose io globally so API routes can emit events
    try { global.io = io } catch(e) { /* ignore if not allowed */ }

  // Simple socket auth using NextAuth JWT (optional). Set NEXTAUTH_SECRET env.
  // Require an authenticated NextAuth session for socket connections.
  io.use(async (socket, nextSock) => {
    try {
      const cookie = socket.handshake.headers.cookie || ''
      console.log('socket handshake from', socket.handshake.headers.origin, 'hasCookie=', !!cookie)

      // Attempt to read the NextAuth token from the cookie via getToken
      const token = await getToken({ req: { headers: { cookie } }, secret: process.env.NEXTAUTH_SECRET, secureCookie: process.env.NODE_ENV === 'production' })

      if (token && token.email) {
        socket.user = { id: token.sub, email: token.email, name: token.name }
        return nextSock()
      }

      // Allow anonymous sockets in development or when explicitly enabled
      const allowAnon = process.env.ALLOW_ANON_SOCKETS === 'true' || (process.env.NODE_ENV !== 'production')
      if (allowAnon) {
        console.log('allowing anonymous socket connection')
        socket.user = null
        return nextSock()
      }

      console.warn('socket auth failed: no valid NextAuth token and anonymous sockets disabled')
      return nextSock(new Error('Unauthorized'))
    } catch (err) {
      console.error('socket auth error', err)
      // If dev, allow anonymous fallback
      if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_ANON_SOCKETS === 'true') {
        console.log('dev fallback: allowing anonymous socket after auth error')
        socket.user = null
        return nextSock()
      }
      return nextSock(new Error('Unauthorized'))
    }
  })

  // engine connection errors (e.g., polling transport failures)
  if(io.engine) {
    io.engine.on && io.engine.on('connection_error', (err) => {
      console.error('engine connection_error', err)
    })
  }

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id)

    // Map user sockets to allow targeting by user id
    if (socket.user?.email) {
      (async () => {
        try {
          const u = await prisma.user.findUnique({ where: { email: socket.user.email } })
          if (u) {
            socket._userId = u.id
            if (!io.userSockets) io.userSockets = new Map()
            const set = io.userSockets.get(u.id) || new Set()
            set.add(socket.id)
            io.userSockets.set(u.id, set)
          }
        } catch (e) { console.error('socket user mapping error', e) }
      })()
    }

    // Conversation room membership
    socket.on('joinConversation', (conversationId) => {
      if (!conversationId) return
      socket.join(`conv:${conversationId}`)
    })

    socket.on('leaveConversation', (conversationId) => {
      if (!conversationId) return
      socket.leave(`conv:${conversationId}`)
    })

    // send message into conversation room
    socket.on('sendMessage', async (payload) => {
      try {
        const { conversationId, content } = payload || {}
        if (!conversationId || !content) return
        const authorId = socket._userId || null
          const msg = await prisma.message.create({ data: { content, authorId, conversationId } })
        const message = await prisma.message.findUnique({ where: { id: msg.id }, include: { author: { select: { id: true, name: true, email: true, image: true } } } })
        io.to(`conv:${conversationId}`).emit('message', message)
      } catch (err) {
        console.error('sendMessage error', err)
        socket.emit('error', 'message_failed')
      }
    })

      // reactions
      socket.on('reaction', async ({ messageId, type }) => {
        try {
          const userId = socket._userId
          if(!userId) return
          // toggle reaction: if exists, remove; else create
          const exists = await prisma.messageReaction.findUnique({ where: { messageId_userId_type: { messageId, userId, type } } }).catch(()=>null)
          if(exists){
            await prisma.messageReaction.delete({ where: { id: exists.id } })
          } else {
            await prisma.messageReaction.create({ data: { messageId, userId, type } })
          }
          const reaction = await prisma.messageReaction.findMany({ where: { messageId }, include: { user: { select: { id: true, name: true } } } })
          // broadcast updated reactions for this message to the conversation room(s)
          // find the conversationId for message
          const m = await prisma.message.findUnique({ where: { id: messageId } })
          if(m && m.conversationId) io.to(`conv:${m.conversationId}`).emit('reactions', { messageId, reactions: reaction })
        } catch(e) { console.error('reaction error', e) }
      })

      // attachments handled via API; notify room when attachment message created

    // typing indicator
    socket.on('typing', ({ conversationId, typing }) => {
      if (!conversationId) return
      socket.to(`conv:${conversationId}`).emit('typing', { userId: socket._userId, typing })
    })

    // read receipts
    socket.on('read', async ({ conversationId, messageIds }) => {
      try {
        if (!conversationId || !Array.isArray(messageIds)) return
        const userId = socket._userId
        for (const mid of messageIds) {
          await prisma.messageRead.upsert({ where: { messageId_userId: { messageId: mid, userId } }, update: { seenAt: new Date() }, create: { messageId: mid, userId } })
        }
          socket.to(`conv:${conversationId}`).emit('read', { userId, messageIds })
          // also emit updated unread count for this conversation
          const unread = await prisma.message.count({ where: { conversationId, authorId: { not: userId }, reads: { none: { userId } } } })
          io.to(`conv:${conversationId}`).emit('conversationUnread', { conversationId, unreadCount: unread })
      } catch (e) { console.error('read receipt error', e) }
    })

    socket.on('disconnect', ()=>{
      console.log('socket disconnected', socket.id)
    })
  })

  // Use a catch-all handler without a path pattern to avoid path-to-regexp issues
  server.use((req, res) => handle(req, res))

  const port = parseInt(process.env.PORT || '3000', 10)
  httpServer.listen(port, (err) => {
    if(err) throw err
    console.log('> Ready on http://localhost:' + port)
  })
})
