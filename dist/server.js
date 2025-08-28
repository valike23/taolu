import http from 'http';
import express from 'express';
import { Server as SocketIoServer } from 'socket.io';
import { handler } from './build/handler.js'; // The SvelteKit handler
const app = express();
const server = http.createServer(app);
// Create the Socket.IO server with type definitions
const io = new SocketIoServer(server);
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Type-safe event handler
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // Broadcast message to all clients
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.use(handler);
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
