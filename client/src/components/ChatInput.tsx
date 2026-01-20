import * as React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { io } from 'socket.io-client';
// simplified: removed icon dependency to reduce external UI libs

interface ChatInputProps {
  username: string;
}

function ChatInput({ username }: ChatInputProps) {
  const [message, setMessage] = React.useState('');
  const socketRef = React.useRef<any>(null);
  const typingTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
    socketRef.current = io(window.location.hostname === 'localhost'
      ? 'http://localhost:3001'
      : window.location.origin, { auth: { sessionId } });

    return () => {
      try { socketRef.current?.emit('typing', false); } catch {};
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('send_message', {
        username: username,
        content: message
      });
      setMessage('');
      try { socketRef.current.emit('typing', false); } catch {}
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMessage(val);
    if (!socketRef.current) return;
    try { socketRef.current.emit('typing', val.trim().length > 0); } catch {}
    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      try { socketRef.current.emit('typing', false); } catch {}
      typingTimerRef.current = null;
    }, 1500);
  };

  return (
    <form onSubmit={handleSendMessage} className="flex gap-2">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        className="flex-1"
      />
      <Button type="submit" disabled={message.trim() === ''} className="gap-2 px-3 py-1 bg-blue-600 text-white rounded">
        Send
      </Button>
    </form>
  );
}

export default ChatInput;
