import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5174;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Gemini API routes will fall back to local mocks.');
}

app.use(express.json());

app.post('/api/gemini/validate', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Gemini API key not configured.' });
  }

  const { code, task } = req.body;
  if (typeof code !== 'string' || typeof task !== 'object') {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/engines/gemini-1/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ code, task }),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Gemini validate error:', error);
    return res.status(500).json({ error: 'Gemini validation failed.' });
  }
});

app.post('/api/gemini/hint', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Gemini API key not configured.' });
  }

  const { task, hintLevel } = req.body;
  if (typeof task !== 'object' || typeof hintLevel !== 'number') {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/engines/gemini-1/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ task, hintLevel }),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Gemini hint error:', error);
    return res.status(500).json({ error: 'Gemini hint failed.' });
  }
});

app.post('/api/gemini/breakdown', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Gemini API key not configured.' });
  }

  const { prompt } = req.body;
  if (typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/engines/gemini-1/breakdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Gemini breakdown error:', error);
    return res.status(500).json({ error: 'Gemini breakdown failed.' });
  }
});

app.listen(port, () => {
  console.log(`Gemini proxy server listening on http://localhost:${port}`);
});
