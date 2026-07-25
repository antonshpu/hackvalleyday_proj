import { Router } from 'express';
import { generateBreakdown, generateHint, generateValidation } from '../services/geminiClient.js';
import { mockBreakdown, mockHint, mockValidate } from '../mock/mockResponses.js';

const router = Router();

const USE_MOCK = (process.env.USE_MOCK ?? 'true').toLowerCase() !== 'false';

router.post('/breakdown', async (req, res) => {
  const { prompt } = req.body ?? {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'A non-empty "prompt" string is required.' });
  }

  if (USE_MOCK) {
    return res.json(mockBreakdown(prompt));
  }

  try {
    const data = await generateBreakdown(prompt);
    res.json(data);
  } catch (err) {
    console.error('Gemini breakdown failed, falling back to mock:', err);
    res.json(mockBreakdown(prompt));
  }
});

router.post('/validate', async (req, res) => {
  const { code, taskDescription, levelTitle } = req.body ?? {};
  if (typeof code !== 'string' || typeof taskDescription !== 'string') {
    return res.status(400).json({ error: '"code" and "taskDescription" strings are required.' });
  }

  if (USE_MOCK) {
    return res.json(mockValidate(code, taskDescription));
  }

  try {
    const data = await generateValidation({ code, taskDescription, levelTitle: levelTitle ?? '' });
    res.json(data);
  } catch (err) {
    console.error('Gemini validation failed, falling back to mock:', err);
    res.json(mockValidate(code, taskDescription));
  }
});

router.post('/hint', async (req, res) => {
  const { taskDescription, currentCode, hintLevel } = req.body ?? {};
  if (typeof taskDescription !== 'string') {
    return res.status(400).json({ error: '"taskDescription" string is required.' });
  }
  const level = typeof hintLevel === 'number' ? hintLevel : 0;

  if (USE_MOCK) {
    return res.json(mockHint(taskDescription, level));
  }

  try {
    const data = await generateHint({ taskDescription, currentCode: currentCode ?? '', hintLevel: level });
    res.json(data);
  } catch (err) {
    console.error('Gemini hint failed, falling back to mock:', err);
    res.json(mockHint(taskDescription, level));
  }
});

export default router;
