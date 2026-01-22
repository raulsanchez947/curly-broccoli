const { io } = require('socket.io-client');

const url = process.argv[2] || 'http://localhost:3001';
const socket = io(url, { transports: ['websocket'], reconnectionAttempts: 2, timeout: 5000 });

socket.on('connect', () => {
  console.log('connected', socket.id);
  socket.disconnect();
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err.message || err);
  process.exit(1);
});

socket.on('error', (e) => {
  console.error('error', e);
});

setTimeout(()=>{
  console.log('timeout waiting');
  process.exit(2);
}, 8000);
