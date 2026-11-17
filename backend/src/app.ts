import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { mkdirSync } from 'node:fs';
import { ZodError } from 'zod';
import multer from 'multer';
import { HttpError, type AppContext } from './core.js';
import { registerAuth } from './modules/auth/index.js';
import { registerBookings } from './modules/booking/index.js';
import { registerCatalog } from './modules/catalog.js';
import { registerCrm } from './modules/crm.js';
import { LocalDiskStorage, R2Storage, type StorageService } from './modules/storage.js';

export function createApp(ctx: AppContext & { storage?: StorageService }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: ctx.config.corsOrigins, credentials: true }));
  app.use(express.json());
  const c = ctx.config;
  const storage = ctx.storage ?? (c.storageBackend === 'local' ? new LocalDiskStorage(c.uploadDir) : new R2Storage({
    endpointUrl: c.r2EndpointUrl!, accessKeyId: c.r2AccessKeyId!, secretAccessKey: c.r2SecretAccessKey!,
    bucketName: c.r2BucketName!, publicUrl: c.r2PublicUrl!, keyPrefix: c.r2KeyPrefix,
  }));
  registerAuth(app, ctx);
  registerBookings(app, ctx);
  registerCatalog(app, ctx, storage);
  registerCrm(app, ctx, storage);
  if (c.storageBackend === 'local') {
    mkdirSync(c.uploadDir, { recursive: true });
    app.use('/uploads', express.static(c.uploadDir));
  }
  app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });
  app.use((_req, res) => { res.status(404).json({ detail: 'Not Found' }); });
  const errors: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (error instanceof HttpError) { res.status(error.status).json({ detail: error.detail }); return; }
    if (error instanceof ZodError) {
      res.status(422).json({ detail: error.issues.map(issue => ({
        type: issue.code, loc: ['body', ...issue.path], msg: issue.message,
      })) }); return;
    }
    if (error instanceof multer.MulterError) { res.status(422).json({ detail: error.message }); return; }
    if (error instanceof SyntaxError && 'body' in error) { res.status(422).json({ detail: 'Invalid JSON' }); return; }
    if (error && typeof error === 'object' && 'type' in error && 'status' in error && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
      res.status(error.status).json({ detail: error instanceof Error ? error.message : 'Bad Request' }); return;
    }
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '23505') { res.status(409).json({ detail: 'Record already exists' }); return; }
      if (['23503', '23502', '23514', '22P02', '22003', '22001'].includes(String(error.code))) {
        res.status(422).json({ detail: 'Invalid data' }); return;
      }
    }
    console.error(error);
    res.status(500).json({ detail: 'Internal Server Error' });
  };
  app.use(errors);
  return app;
}
