import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { authOptional } from './auth.js';
import { runSeed } from './seed.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Create tables + seed data/admin before serving.
runSeed();

const app = express();
app.use(cors({ origin: config.clientOrigin, credentials: false }));
app.use(express.json());
app.use(authOptional);

// Uploaded product photos.
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'beco-bearings-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Fallback error handler (e.g. multer file-size / type errors).
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 400).json({ error: err.message || 'Something went wrong.' });
});

app.listen(config.port, () => {
  console.log(`[beco] API listening on http://localhost:${config.port}`);
  console.log(`[beco] CORS origin: ${config.clientOrigin}`);
});
