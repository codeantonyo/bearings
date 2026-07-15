import 'dotenv/config';

// Resolve a Postgres connection string from whatever the host injected. Neon /
// Vercel Postgres integrations use different variable names, so we check the
// common ones and, as a last resort, assemble a URL from the individual PG*
// parts (which Neon always provides).
function resolveDatabaseUrl() {
  const direct =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL;
  if (direct) return direct;

  const host = process.env.PGHOST || process.env.POSTGRES_HOST;
  const user = process.env.PGUSER || process.env.POSTGRES_USER;
  const pass = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || '';
  const name = process.env.PGDATABASE || process.env.POSTGRES_DATABASE;
  if (host && user && name) {
    const port = process.env.PGPORT || 5432;
    const auth = `${encodeURIComponent(user)}:${encodeURIComponent(pass)}`;
    return `postgres://${auth}@${host}:${port}/${name}?sslmode=require`;
  }
  return '';
}

// Names we look at, for the /api/health diagnostic (values are never exposed).
const DB_ENV_NAMES = [
  'DATABASE_URL', 'POSTGRES_URL', 'DATABASE_URL_UNPOOLED', 'POSTGRES_URL_NON_POOLING',
  'POSTGRES_PRISMA_URL', 'PGHOST', 'PGUSER', 'PGDATABASE', 'PGPASSWORD',
  'POSTGRES_HOST', 'POSTGRES_USER', 'POSTGRES_DATABASE',
];

export const dbEnvSeen = () => DB_ENV_NAMES.filter((n) => !!process.env[n]);

// True on Vercel (and most serverless hosts), where the filesystem is read-only.
export const isServerless = !!(process.env.VERCEL || process.env.AWS_REGION || process.env.NOW_REGION);

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'beco-dev-secret-change-in-production',
  jwtExpiresIn: '7d',
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@becobearings.com').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || 'beco-admin-2026',
  databaseUrl: resolveDatabaseUrl(),
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || '',
};
