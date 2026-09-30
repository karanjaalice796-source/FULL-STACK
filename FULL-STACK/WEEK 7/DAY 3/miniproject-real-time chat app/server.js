const express = require('express');
const http = require('http');
const { randomUUID } = require('crypto');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3002;
const rooms = new Map();
const histories = new Map();
const historyLimit = 80;

app.use(express.static(path.join(__dirname, 'public')));

function normalizeRoom(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').slice(0, 32);
}

function getUsers(room) {
  return [...(rooms.get(room)?.values() || [])].map(({ username }) => ({ username }));
}

function emitUsers(room) {
  io.to(room).emit('room:users', getUsers(room));
}

function addHistory(room, message) {
  const history = histories.get(room) || [];
  history.push(message);
  if (history.length > historyLimit) history.shift();
  histories.set(room, history);
  return message;
}

function emitSystemMessage(room, text) {
  io.to(room).emit('chat:message', addHistory(room, {
    id: randomUUID(),
    type: 'system',
    text,
    time: new Date().toISOString(),
  }));
}

function leaveRoom(socket) {
  const room = socket.data.chatRoom;
  if (!room) return;

  const roomUsers = rooms.get(room);
  const user = roomUsers?.get(socket.id);
  roomUsers?.delete(socket.id);
  if (roomUsers?.size === 0) rooms.delete(room);
  socket.leave(room);
  delete socket.data.chatRoom;
  delete socket.data.username;

  if (user) {
    emitSystemMessage(room, `${user.username} left the room`);
    emitUsers(room);
  }
}

io.on('connection', (socket) => {
  socket.on('room:join', (payload = {}, acknowledge = () => {}) => {
    const username = typeof payload.username === 'string' ? payload.username.trim() : '';
    const room = normalizeRoom(payload.room);
    if (!username || username.length > 24 || !room) {
      acknowledge({ ok: false, error: 'Choose a username and a valid room name (up to 32 characters).' });
      return;
    }

    leaveRoom(socket);
    socket.data.username = username;
    socket.data.chatRoom = room;
    socket.join(room);

    if (!rooms.has(room)) rooms.set(room, new Map());
    rooms.get(room).set(socket.id, { username });
    socket.emit('room:history', histories.get(room) || []);
    emitSystemMessage(room, `${username} joined the room`);
    emitUsers(room);
    acknowledge({ ok: true, username, room });
  });

  socket.on('room:leave', () => leaveRoom(socket));

  socket.on('chat:send', (payload = {}, acknowledge = () => {}) => {
    const room = socket.data.chatRoom;
    const text = typeof payload.text === 'string' ? payload.text.trim() : '';
    if (!room || !text || text.length > 2000) {
      acknowledge({ ok: false, error: 'Message must be between 1 and 2000 characters.' });
      return;
    }

    const message = addHistory(room, {
      id: randomUUID(),
      type: 'user',
      username: socket.data.username,
      text,
      time: new Date().toISOString(),
    });
    io.to(room).emit('chat:message', message);
    acknowledge({ ok: true });
  });

  socket.on('disconnect', () => leaveRoom(socket));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Chat app listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, server, io };
