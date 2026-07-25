import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function getModel() {
  if (!client) throw new Error('GEMINI_API_KEY is not set');
  return client.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' },
  });
}

function extractJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/, '');
  return JSON.parse(cleaned);
}

export async function generateBreakdown(prompt: string) {
  const model = getModel();
  const systemPrompt = `You are a coding-education game designer. A learner wants to build: "${prompt}".

Break this project into 5 to 8 progressive levels. Each level must have:
- id (kebab-case string)
- title (short, "Level N — <name>")
- summary (one sentence)
- fileName (the single file this level's code lives in, e.g. "game.js")
- starterCode (a short code snippet with a single line comment starting with "// 🟡 TASK: " describing exactly one thing the learner must implement; leave the implementation blank/empty for them to fill in)
- tasks: an array with exactly one task object: { id, description (matches the TASK comment), marker (copy of the TASK comment text), completed: false, hintsUsed: 0 }
- completed: false

Respond with ONLY a JSON object of this exact shape (no markdown fences, no prose):
{
  "projectName": string,
  "description": string,
  "files": [{ "name": string, "path": string, "language": string }],
  "levels": [ ...level objects as described above... ]
}`;

  const result = await model.generateContent(systemPrompt);
  return extractJson(result.response.text());
}

export async function generateValidation(params: {
  code: string;
  taskDescription: string;
  levelTitle: string;
}) {
  const model = getModel();
  const prompt = `You are grading a coding-education exercise inside level "${params.levelTitle}".
Task: "${params.taskDescription}"

Learner's current code:
\`\`\`
${params.code}
\`\`\`

Decide if the task is correctly completed. Be encouraging but honest — partial or placeholder code
(e.g. an empty function body) is NOT correct. Respond with ONLY JSON of this exact shape:
{ "correct": boolean, "confidence": number between 0 and 1, "feedback": "one or two encouraging sentences" }`;

  const result = await model.generateContent(prompt);
  return extractJson(result.response.text());
}

export async function generateHint(params: {
  taskDescription: string;
  currentCode: string;
  hintLevel: number;
}) {
  const model = getModel();
  const escalation =
    params.hintLevel === 0
      ? 'Give a conceptual nudge only. Do NOT reveal syntax or exact code.'
      : params.hintLevel === 1
      ? 'Give a more specific nudge — you may name the function/API to use, but do not write the full line of code.'
      : 'Give a concrete nudge close to the answer, but still let the learner write the final line themselves.';

  const prompt = `A learner is stuck on this task: "${params.taskDescription}".
Their current code:
\`\`\`
${params.currentCode}
\`\`\`
This is hint request number ${params.hintLevel + 1}. ${escalation}
Respond with ONLY JSON: { "hint": "one to two sentences", "hintLevel": ${params.hintLevel} }`;

  const result = await model.generateContent(prompt);
  return extractJson(result.response.text());
}

export const geminiConfigured = Boolean(apiKey);
