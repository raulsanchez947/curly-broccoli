// Load local env vars when running server.js directly
try { require('dotenv').config({ path: '.env.local' }) } catch (e) {}

const next = require('next')
const express = require('express')
const http = require('http')
const { PrismaClient } = require('@prisma/client')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const prisma = new PrismaClient()

app.prepare().then(() => {
  const server = express()
  const httpServer = http.createServer(server)
  // Socket.IO and realtime features removed: server will only serve Next.js via Express handler

  // Use a catch-all handler without a path pattern to avoid path-to-regexp issues
  server.use((req, res) => handle(req, res))

  const port = parseInt(process.env.PORT || '3000', 10)
  httpServer.listen(port, (err) => {
    if(err) throw err
    console.log('> Ready on http://localhost:' + port)
  })
})
