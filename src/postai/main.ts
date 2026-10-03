import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      service: 'PostaAi API',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'PostaAi API',
      database: 'disconnected',
      error: (error as Error).message
    });
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join-room', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`[Socket.io] User ${userId} joined personal room`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('[Database] Successfully connected to database');

    httpServer.listen(PORT, () => {
      console.log(`[Server] PostaAi backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[Fatal] Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  httpServer.close(() => {
    process.exit(0);
  });
});

bootstrap();
