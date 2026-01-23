const { io } = require('socket.io-client');

const url = process.env.URL || 'http://localhost:3001';
console.log('Connecting to', url);
const socket = io(url, { transports: ['websocket'], withCredentials: true, autoConnect: true });

socket.on('connect', () => {
  console.log('connected', socket.id);
  // join a test conversation and send a test message
  socket.emit('joinConversation', 'test-conv');
  socket.emit('sendMessage', { conversationId: 'test-conv', content: 'hello from test client' });
  setTimeout(() => {
    console.log('closing socket');
    socket.close();
  }, 2000);
});

socket.on('message', (m) => console.log('message event:', m));
socket.on('connect_error', (err) => console.error('connect_error', err && err.message ? err.message : err));
socket.on('error', (e) => console.error('socket error', e));

setTimeout(() => {
  if (!socket.connected) console.error('socket did not connect within timeout');
}, 5000);
