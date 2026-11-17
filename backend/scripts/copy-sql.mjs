import { copyFile } from 'node:fs/promises';
await copyFile(new URL('../src/db/baseline.sql', import.meta.url), new URL('../dist/db/baseline.sql', import.meta.url));
