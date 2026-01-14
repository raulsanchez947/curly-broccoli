import * as React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import ChatBox from '../components/ChatBox';
import ChatInput from '../components/ChatInput';

function ChatPage() {
  const [username, setUsername] = React.useState<string>('');
  const [isJoined, setIsJoined] = React.useState(false);

  const handleJoinChat = (name: string) => {
    if (name.trim()) {
      setUsername(name);
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Live Chat</h1>
            <UsernameForm onJoin={handleJoinChat} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Live Chat</h1>
        <p className="text-gray-600">Chatting as <span className="font-semibold">{username}</span></p>
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        <ChatBox username={username} />
        <ChatInput username={username} />
      </div>
    </div>
  );
}

interface UsernameFormProps {
  onJoin: (username: string) => void;
}

function UsernameForm({ onJoin }: UsernameFormProps) {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Enter your name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
      </div>
      <Button type="submit" className="w-full">
        Join Chat
      </Button>
    </form>
  );
}

export default ChatPage;
