import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { setupStaticServing } from './static-serve.js';
import { setupChat } from './chat.js';
import { initDatabase } from './database.js';
import { setupAuth } from './auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup authentication routes
setupAuth(app);

// Setup chat with socket.io
setupChat(httpServer);

// example endpoint
// app.get('/api/hello', (req: express.Request, res: express.Response) => {
//   res.json({ message: 'Hello World!' });
// });

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    // Initialize database before starting the server
    await initDatabase();

    httpServer.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
