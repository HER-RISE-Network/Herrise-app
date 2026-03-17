import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import itemsRouter from './routes/items.js';
import authRouter from './routes/auth.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Herrise API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const onlineUsers = new Map();

function broadcastOnlineUsers() {
  const list = Array.from(onlineUsers.values()).map((u) => ({
    id: u.id,
    name: u.name,
  }));
  io.to('community').emit('online-users', list);
}

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  socket.join('community');

  const { id, name } = socket.user;
  const existing = onlineUsers.get(id) || { id, name, sockets: new Set() };
  existing.sockets.add(socket.id);
  onlineUsers.set(id, existing);
  broadcastOnlineUsers();

  socket.on('message', (text) => {
    if (typeof text !== 'string' || !text.trim()) return;
    const msg = {
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      userId: socket.user.id,
      name: socket.user.name,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    io.to('community').emit('message', msg);
  });

  socket.on('private-message', ({ toUserId, text }) => {
    if (!toUserId || typeof text !== 'string' || !text.trim()) return;
    const target = onlineUsers.get(toUserId);
    if (!target) return;

    const msg = {
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      fromUserId: socket.user.id,
      fromName: socket.user.name,
      toUserId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    const sender = onlineUsers.get(socket.user.id);
    if (sender) {
      sender.sockets.forEach((sid) => {
        io.to(sid).emit('private-message', msg);
      });
    }

    target.sockets.forEach((sid) => {
      io.to(sid).emit('private-message', msg);
    });
  });

  socket.on('disconnect', () => {
    const entry = onlineUsers.get(id);
    if (!entry) return;
    entry.sockets.delete(socket.id);
    if (entry.sockets.size === 0) {
      onlineUsers.delete(id);
    } else {
      onlineUsers.set(id, entry);
    }
    broadcastOnlineUsers();
  });
});

async function start() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
