import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import geminiRouter from './routes/gemini.js';
import { geminiConfigured } from './services/geminiClient.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const USE_MOCK = (process.env.USE_MOCK ?? 'true').toLowerCase() !== 'false';
const CORS_ORIGIN = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: USE_MOCK ? 'mock' : geminiConfigured ? 'live' : 'live (no key set — will fall back to mock)',
  });
});

app.use('/api/gemini', geminiRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Code Quest Tutor server running on http://localhost:${PORT}`);
  console.log(`Mode: ${USE_MOCK ? 'MOCK (no Gemini key needed)' : 'LIVE Gemini API'}`);
});
