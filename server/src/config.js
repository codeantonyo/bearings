import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'beco-dev-secret-change-in-production',
  jwtExpiresIn: '7d',
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@becobearings.com').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || 'beco-admin-2026',
  // Postgres connection string (Neon / Vercel Postgres). When absent we fall
  // back to an in-process PGlite database for zero-setup local development.
  databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
  // Vercel Blob token (auto-set when a Blob store is linked on Vercel). When
  // absent, uploaded photos are written to the local uploads/ folder instead.
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || '',
};
