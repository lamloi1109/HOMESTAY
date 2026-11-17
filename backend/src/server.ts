import pg from 'pg';
import { createApp } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const pool = new pg.Pool({ connectionString: config.databaseUrl });
const server = createApp({ pool, config }).listen(config.port, '0.0.0.0', () => {
  console.log(`Homestay API listening on port ${config.port}`);
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => { void pool.end().then(() => { process.exit(0); }); });
  });
}
