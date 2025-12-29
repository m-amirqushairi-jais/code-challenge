import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import resourceRoutes from './routes/resource.routes.js';
import { initDatabase } from './db/index.js';

config();

const PORT = process.env.PORT || 3031;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app: Application = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'CRUD API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      resources: '/api/resources',
    },
    documentation: 'See README.md for API documentation',
  });
});
app.use('/api/resources', resourceRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

function setupDatabase(): void {
  try {
    console.log('\n=== Initializing Database ===');
    initDatabase();
    console.log('=== Database Ready ===\n');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

function startServer(): void {
  // Initialize database first
  setupDatabase();

  // Start listening
  app.listen(Number(PORT), HOST, () => {
    console.log('='.repeat(50));
    console.log('🚀 Server is running');
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🌐 URL: http://${HOST}:${PORT}`);
    console.log(`📊 Health Check: http://${HOST}:${PORT}/health`);
    console.log(`📚 API Endpoints: http://${HOST}:${PORT}/api/resources`);
    console.log('='.repeat(50));
    console.log('\nServer ready to accept requests...\n');
  });
}

function gracefulShutdown(signal: string): void {
  console.log(`\n${signal} received. Closing server gracefully...`);

  // db.close();

  console.log('✓ Server shut down successfully');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();