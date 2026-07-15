import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(__dirname, '..', 'uploads');

// Store an uploaded product photo. On Vercel (BLOB_READ_WRITE_TOKEN present) it
// goes to Vercel Blob and returns an absolute CDN URL. Locally it's written to
// server/uploads/ and returns a /uploads/... path served by Express.
export async function saveImage(file) {
  const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
  const name = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

  if (config.blobToken) {
    const { put } = await import('@vercel/blob');
    const { url } = await put(`products/${name}`, file.buffer, {
      access: 'public',
      token: config.blobToken,
      contentType: file.mimetype,
    });
    return url;
  }

  fs.mkdirSync(uploadsDir, { recursive: true });
  await fs.promises.writeFile(path.join(uploadsDir, name), file.buffer);
  return `/uploads/${name}`;
}

// Best-effort removal of a previously stored photo.
export async function removeImage(image) {
  if (!image) return;
  try {
    if (/^https?:\/\//.test(image)) {
      if (config.blobToken) {
        const { del } = await import('@vercel/blob');
        await del(image, { token: config.blobToken });
      }
    } else if (image.startsWith('/uploads/')) {
      await fs.promises.unlink(path.join(uploadsDir, path.basename(image)));
    }
  } catch {
    /* ignore missing files */
  }
}
