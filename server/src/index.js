// Local development entry point — runs the same Express app with a listener.
// On Vercel the app is invoked as a serverless function via /api/index.js.
import { config } from './config.js';
import { createApp } from './app.js';
import { ensureReady } from './db.js';

const app = createApp();

ensureReady()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`[beco] API listening on http://localhost:${config.port}`);
      console.log(`[beco] database: ${config.databaseUrl ? 'Postgres (DATABASE_URL)' : 'PGlite (local .pgdata)'}`);
    });
  })
  .catch((err) => {
    console.error('[beco] failed to initialise database:', err);
    process.exit(1);
  });
