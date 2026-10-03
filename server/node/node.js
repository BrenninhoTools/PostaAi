const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', apiLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'PostaAi Node Core Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const activeConnections = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
  if (!token) {
    return next(new Error('Authentication failed: Missing token'));
  }
  socket.data.userId = socket.handshake.query?.userId || 'anonymous';
  next();
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  activeConnections.set(socket.id, userId);
  
  socket.join(`user:${userId}`);

  socket.on('feed:subscribe', (data) => {
    socket.join(`feed:${data.feedId}`);
  });

  socket.on('post:like', (data) => {
    io.to(`feed:${data.feedId}`).emit('post:updated', {
      postId: data.postId,
      action: 'like',
      userId
    });
  });

  socket.on('post:comment', (data) => {
    io.to(`feed:${data.feedId}`).emit('post:updated', {
      postId: data.postId,
      action: 'comment',
      comment: data.comment,
      userId
    });
  });

  socket.on('disconnect', () => {
    activeConnections.delete(socket.id);
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message
  });
});

server.listen(PORT, () => {
  console.log(`[Server] PostaAi Node service running on port ${PORT}`);
});
