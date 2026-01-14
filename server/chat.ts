import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { getDatabase } from './database.js';

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

    // Load and send chat history to new user
    socket.on('request_messages', async () => {
      try {
        socket.emit('chat_history', messageStore);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    });

    // Handle new messages
    socket.on('send_message', async (data: { username: string; content: string }) => {
      try {
        const timestamp = Date.now();
        
        const message: Message = {
          id: messageId++,
          username: data.username,
          content: data.content,
          timestamp: timestamp,
          created_at: new Date().toISOString()
        };

        messageStore.push(message);

        // Broadcast to all connected users
        io.emit('new_message', message);
        console.log(`Message from ${data.username}: ${data.content}`);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', 'Failed to save message');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}
