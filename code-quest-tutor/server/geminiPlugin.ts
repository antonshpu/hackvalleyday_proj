import type { Connect, Plugin } from 'vite';
import {
  geminiBreakdown,
  geminiHint,
  geminiValidate,
  hasGeminiKey,
  configureGemini,
} from './geminiClient';

async function readJson(req: Connect.IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

function sendJson(res: Connect.ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export interface GeminiPluginOptions {
  apiKey?: string;
  model?: string;
}

export function geminiApiPlugin(options: GeminiPluginOptions = {}): Plugin {
  return {
    name: 'gemini-api',
    configureServer(server) {
      configureGemini({
        apiKey: options.apiKey,
        model: options.model || 'gemini-flash-latest',
      });

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini')) return next();

        try {
          if (req.method === 'GET' && req.url === '/api/gemini/status') {
            return sendJson(res, 200, {
              configured: hasGeminiKey(),
              model: options.model || 'gemini-flash-latest',
            });
          }

          if (!hasGeminiKey()) {
            return sendJson(res, 503, {
              error: 'GEMINI_API_KEY is missing. Add it to code-quest-tutor/.env and restart.',
            });
          }

          if (req.method === 'POST' && req.url === '/api/gemini/breakdown') {
            const body = await readJson(req);
            const prompt = String(body.prompt || '').trim();
            if (!prompt) return sendJson(res, 400, { error: 'prompt is required' });
            const plan = await geminiBreakdown(prompt);
            return sendJson(res, 200, plan);
          }

          if (req.method === 'POST' && req.url === '/api/gemini/validate') {
            const body = await readJson(req);
            const result = await geminiValidate(String(body.code || ''), body.task || {});
            return sendJson(res, 200, result);
          }

          if (req.method === 'POST' && req.url === '/api/gemini/hint') {
            const body = await readJson(req);
            const result = await geminiHint(body.task || {}, Number(body.hintLevel) || 1);
            return sendJson(res, 200, result);
          }

          return sendJson(res, 404, { error: 'Unknown Gemini route' });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Gemini request failed';
          console.error('[gemini]', message);
          return sendJson(res, 500, { error: message });
        }
      });
    },
  };
}
