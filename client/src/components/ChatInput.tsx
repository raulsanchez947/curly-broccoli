import * as React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';

interface ChatInputProps {
  username: string;
}

function ChatInput({ username }: ChatInputProps) {
  const [message, setMessage] = React.useState('');
  const socketRef = React.useRef<any>(null);

  React.useEffect(() => {
    socketRef.current = io(window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : window.location.origin);

    return () => {
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
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex gap-2">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm" className="gap-2">
        <Send className="w-4 h-4" />
        Send
      </Button>
    </form>
  );
}

export default ChatInput;
