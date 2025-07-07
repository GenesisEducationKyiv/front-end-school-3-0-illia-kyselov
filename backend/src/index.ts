import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import routes from './routes';
import { initializeDb, getTracks } from './utils/db';
import config from './config';
import { WebSocketServer, WebSocket } from 'ws';

async function start() {
  try {
    console.log(`Starting server in ${config.server.env} mode`);

    await initializeDb();

    const fastify = Fastify({
      logger: {
        level: config.logger.level,
        transport: config.isDevelopment
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
      },
    });

    await fastify.register(cors, {
      origin: [
        'http://localhost:3000',
        'https://olharyzha.github.io',
        'https://your-vercel-frontend.vercel.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: config.upload.maxFileSize,
      },
    });

    await fastify.register(fastifyStatic, {
      root: config.storage.uploadsDir,
      prefix: '/api/files/',
      decorateReply: false,
      maxAge: '7d',
      immutable: true,
    });

    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'Music Tracks API',
          description: 'API for managing music tracks',
          version: '1.0.0',
        },
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
    });

    await fastify.register(routes);

    const clients = new Set<WebSocket>();
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
      console.log('➕ New WebSocket client connected');
      clients.add(ws);

      ws.on('close', () => {
        console.log('➖ Client disconnected');
        clients.delete(ws);
      });
    });

    const port = Number(process.env.PORT) || config.server.port;

    await fastify.listen({ port, host: '0.0.0.0' });

    fastify.server.on('upgrade', (request, socket, head) => {
      if (request.url === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    });

    // Periodically send random track
    async function sendRandomTrack() {
      const { tracks } = await getTracks({ page: 1, limit: 100 });
      if (tracks.length === 0) return;

      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      const msg = JSON.stringify({ type: 'ACTIVE_TRACK', payload: randomTrack });

      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) client.send(msg);
      }
    }

    setInterval(sendRandomTrack, Math.random() * 2000 + 3000);

    console.log(`🚀 Server is running on http://0.0.0.0:${port}`);
    console.log(`📘 Swagger docs: http://0.0.0.0:${port}/documentation`);
    console.log(`🟢 WS server ready at ws://0.0.0.0:${port}/ws`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

start();
