import { Server } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import fs from 'fs'
import http from 'http'

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('joinPost', (postId) => {
    socket.join(postId);
  });

  socket.on('newComment', (postId, comment) => {
    io.to(postId).emit('newComment', comment);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
