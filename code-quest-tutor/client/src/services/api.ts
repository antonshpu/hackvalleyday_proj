import type { HintResult, ProjectBreakdown, ValidationResult } from '../types';
import { FLAPPY_BIRD_MOCK } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request to ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProjectBreakdown(prompt: string): Promise<ProjectBreakdown> {
  try {
    return await postJson<ProjectBreakdown>('/api/gemini/breakdown', { prompt });
  } catch (err) {
    // Server unreachable (e.g. you haven't started it yet) — fall back to a
    // local demo project so the UI is still fully explorable.
    console.warn('Falling back to local mock breakdown:', err);
    return { ...FLAPPY_BIRD_MOCK, projectName: prompt || FLAPPY_BIRD_MOCK.projectName };
  }
}

export async function validateCode(params: {
  code: string;
  taskDescription: string;
  levelTitle: string;
}): Promise<ValidationResult> {
  try {
    return await postJson<ValidationResult>('/api/gemini/validate', params);
  } catch (err) {
    console.warn('Validation request failed, using heuristic fallback:', err);
    // Offline heuristic: did they change anything meaningful near the TASK line?
    const correct = params.code.trim().length > 40;
    return {
      correct,
      confidence: 0.4,
      feedback: correct
        ? "Looks reasonable! (Offline mode — connect the server for real AI grading.)"
        : 'Try writing a bit more code for this task. (Offline mode — start the server for real AI grading.)',
    };
  }
}

export async function fetchHint(params: {
  taskDescription: string;
  currentCode: string;
  hintLevel: number;
}): Promise<HintResult> {
  try {
    return await postJson<HintResult>('/api/gemini/hint', params);
  } catch (err) {
    console.warn('Hint request failed, using canned fallback:', err);
    const canned = [
      'Re-read the TASK comment closely — it usually names the exact variable or function to use.',
      'Check the surrounding code for a similar pattern you can copy the shape of.',
      'Try writing just one line that does the simplest version of what is asked, then run it.',
    ];
    return { hint: canned[Math.min(params.hintLevel, canned.length - 1)], hintLevel: params.hintLevel };
  }
}
