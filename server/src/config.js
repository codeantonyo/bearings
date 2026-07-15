import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'beco-dev-secret-change-in-production',
  jwtExpiresIn: '7d',
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@becobearings.com').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || 'beco-admin-2026',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
