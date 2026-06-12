import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDb } from './config/db.js';
import { allowedOrigins } from './config/cors.js';
import { configureSockets } from './sockets/index.js';

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins(),
    credentials: true
  }
});

configureSockets(io);

connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Civic Connect API listening on ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
