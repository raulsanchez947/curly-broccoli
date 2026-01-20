import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { getDatabase, saveMessage, getAllMessages, createUserIfNotExists } from './database.js';
import { getUsernameForSession } from './auth.js';

interface Message {
  id?: number;
  username: string;
  content: string;
  timestamp: number;
  created_at?: string;
}

let messageStore: Message[] = [];
let messageId = 1;

export function setupChat(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Determine username from session if available
    const sessionId = (socket.handshake && (socket.handshake.auth as any)?.sessionId) || undefined;
    const connectedUsername = getUsernameForSession(sessionId) || undefined;

    // Load and send chat history to new user
    socket.on('request_messages', async () => {
      try {
        const msgs = await getAllMessages();
        socket.emit('chat_history', msgs || []);
      } catch (error) {
        console.error('Error loading messages:', error);
        socket.emit('chat_history', []);
      }
    });

    // Handle new messages
    socket.on('send_message', async (data: { username: string; content: string }) => {
      try {
        const timestamp = Date.now();
        const username = connectedUsername || data.username || 'Anonymous';

        // Ensure user exists (best-effort)
        if (username) {
          createUserIfNotExists(username).catch(() => {});
        }

        const saved = await saveMessage(username, data.content, timestamp);

        const message: Message = {
          id: saved.id as unknown as number,
          username: saved.username,
          content: saved.content,
          timestamp: saved.timestamp as unknown as number,
          created_at: saved.created_at
        };

        messageStore.push(message);

        // Broadcast to all connected users
        io.emit('new_message', message);
        console.log(`Message from ${username}: ${data.content}`);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', 'Failed to save message');
      }
    });

    // Handle typing indicator
    socket.on('typing', (isTyping: boolean) => {
      try {
        const username = connectedUsername || 'Anonymous';
        io.emit('typing', { username, isTyping });
      } catch (err) {
        // swallow errors for typing events
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}
