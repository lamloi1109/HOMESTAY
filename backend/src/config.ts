import 'dotenv/config';

export interface Config {
  databaseUrl: string;
  jwtSecret: string;
  accessTokenExpireMinutes: number;
  bookingHoldMinutes: number;
  maxBookingNights: number;
  corsOrigins: string[];
  storageBackend: 'local' | 'r2';
  uploadDir: string;
  r2EndpointUrl?: string;
  r2AccessKeyId?: string;
  r2SecretAccessKey?: string;
  r2BucketName?: string;
  r2PublicUrl?: string;
  r2KeyPrefix: string;
  port: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const value = (key: string, fallback?: string) => env[`HOMESTAY_${key}`] ?? fallback;
  const integer = (key: string, fallback: number) => {
    const n = Number(value(key, String(fallback)));
    if (!Number.isSafeInteger(n) || n < 1) throw new Error(`Invalid HOMESTAY_${key}`);
    return n;
  };
  const storageBackend = value('STORAGE_BACKEND', 'local');
  if (storageBackend !== 'local' && storageBackend !== 'r2') throw new Error('Invalid HOMESTAY_STORAGE_BACKEND');
  if (value('JWT_ALGORITHM', 'HS256') !== 'HS256') throw new Error('Only HS256 JWTs are supported');
  const origins = value('CORS_ORIGINS', '["http://localhost:3000"]')!;
  const corsOrigins: unknown = JSON.parse(origins);
  if (!Array.isArray(corsOrigins) || !corsOrigins.every((s) => typeof s === 'string')) {
    throw new Error('HOMESTAY_CORS_ORIGINS must be a JSON string array');
  }
  const jwtSecret = value('JWT_SECRET', 'dev-only-secret-change-in-production-0123456789')!;
  if (env.NODE_ENV === 'production' && (!value('JWT_SECRET') || jwtSecret.startsWith('dev-only-'))) {
    throw new Error('Set HOMESTAY_JWT_SECRET in production');
  }
  return {
    databaseUrl: value('DATABASE_URL', 'postgresql://homestay:homestay@127.0.0.1:5432/homestay')!
      .replace(/^postgresql\+(asyncpg|psycopg):/, 'postgresql:'),
    jwtSecret,
    accessTokenExpireMinutes: integer('ACCESS_TOKEN_EXPIRE_MINUTES', 1440),
    bookingHoldMinutes: integer('BOOKING_HOLD_MINUTES', 15),
    maxBookingNights: integer('MAX_BOOKING_NIGHTS', 30),
    corsOrigins,
    storageBackend,
    uploadDir: value('UPLOAD_DIR', 'uploads')!,
    r2EndpointUrl: value('R2_ENDPOINT_URL'),
    r2AccessKeyId: value('R2_ACCESS_KEY_ID'),
    r2SecretAccessKey: value('R2_SECRET_ACCESS_KEY'),
    r2BucketName: value('R2_BUCKET_NAME'),
    r2PublicUrl: value('R2_PUBLIC_URL'),
    r2KeyPrefix: value('R2_KEY_PREFIX', 'properties')!,
    port: Number(env.PORT ?? value('PORT', '8000')),
  };
}
