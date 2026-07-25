import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { geminiApiPlugin } from './server/geminiPlugin';

function cleanEnv(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return undefined;
  return trimmed;
}

export default defineConfig(({ mode }) => {
  // Load .env into the Vite Node process only (never exposed to the browser).
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = cleanEnv(env.GEMINI_API_KEY);
  const model = cleanEnv(env.GEMINI_MODEL) || 'gemini-flash-latest';

  if (apiKey) {
    console.log(`[gemini] API key loaded (${apiKey.length} chars), model=${model}`);
  } else {
    console.warn('[gemini] GEMINI_API_KEY missing in .env — using mock fallback');
  }

  return {
    plugins: [
      react(),
      geminiApiPlugin({
        apiKey,
        model,
      }),
    ],
    server: {
      port: 5173,
    },
  };
});
