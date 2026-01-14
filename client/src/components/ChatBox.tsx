import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { io } from 'socket.io-client';

interface Message {
  id: number;
  username: string;
  content: string;
  timestamp: number;
  created_at: string;
}

interface ChatBoxProps {
  username: string;
}

function ChatBox({ username }: ChatBoxProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : window.location.origin);
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to chat server');
      socket.emit('request_messages');
    });

    socket.on('chat_history', (history: Message[]) => {
      console.log('Received chat history:', history);
      setMessages(history);
    });

    socket.on('new_message', (message: Message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('error', (error: string) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex-1 p-4 overflow-y-auto bg-gray-50">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div>
                <div className="font-semibold text-sm">{msg.username}</div>
                <div className="text-gray-700">{msg.content}</div>
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
}

export default ChatBox;
