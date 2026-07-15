// Vercel serverless entry point. All /api/* requests are routed here (see
// vercel.json) and handled by the Express app.
import { createApp } from '../server/src/app.js';

const app = createApp();

export default app;
