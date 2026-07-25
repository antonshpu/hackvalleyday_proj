import { GoogleGenerativeAI } from '@google/generative-ai';
import type { HintResult, ProjectPlan, Task, ValidationResult } from '../src/types';

type GeminiConfig = {
  apiKey?: string;
  model?: string;
};

let config: GeminiConfig = {
  model: 'gemini-flash-latest',
};

function clean(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return undefined;
  return trimmed;
}

export function configureGemini(next: GeminiConfig) {
  config = {
    apiKey: clean(next.apiKey) ?? clean(config.apiKey),
    model: clean(next.model) || 'gemini-flash-latest',
  };
}

function getModel() {
  const key = clean(config.apiKey);
  if (!key) return null;
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({
    model: clean(config.model) || 'gemini-flash-latest',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  });
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizePlan(raw: any, prompt: string): ProjectPlan {
  const levels = Array.isArray(raw?.levels) ? raw.levels : [];
  return {
    projectName: String(raw?.projectName || prompt).slice(0, 80),
    description: String(raw?.description || `A guided build of "${prompt}".`),
    levels: levels.slice(0, 6).map((lvl: any, index: number) => {
      const tasks = (Array.isArray(lvl?.tasks) ? lvl.tasks : []).slice(0, 4).map((t: any, ti: number) => {
        const starterCode = String(
          t?.starterCode || `// 🟡 TASK: implement "${t?.title || `task ${ti + 1}`}"\n`,
        );
        return {
          id: String(t?.id || `${slug(String(t?.title || 'task'))}-${ti}`),
          title: String(t?.title || `Task ${ti + 1}`),
          description: String(t?.description || 'Complete this step.'),
          starterCode: starterCode.includes('🟡 TASK')
            ? starterCode
            : `// 🟡 TASK: ${String(t?.title || 'complete this')}\n${starterCode}`,
          solutionHint: Array.isArray(t?.solutionHint)
            ? t.solutionHint.map(String).slice(0, 3)
            : ['Re-read the task and try the smallest possible change.'],
          taskMarker: '🟡 TASK',
          completed: false,
        };
      });

      const language = (['javascript', 'html', 'css', 'typescript'].includes(lvl?.language)
        ? lvl.language
        : 'javascript') as ProjectPlan['levels'][number]['language'];

      return {
        id: String(lvl?.id || `level-${index}`),
        index,
        title: String(lvl?.title || `Level ${index + 1}`),
        summary: String(lvl?.summary || `Level ${index + 1}`),
        language,
        fileName: String(lvl?.fileName || `level${index + 1}.js`),
        boilerplate:
          String(lvl?.boilerplate || '') ||
          tasks.map((t: Task) => t.starterCode).join('\n\n'),
        tasks,
        xpReward: Number(lvl?.xpReward) || 100 + index * 25,
        completed: false,
      };
    }),
  };
}

export async function geminiBreakdown(prompt: string): Promise<ProjectPlan> {
  const model = getModel();
  if (!model) throw new Error('GEMINI_API_KEY is not set');

  const result = await model.generateContent(`You are Toast Code, a gamified coding tutor.
Break the learner's project idea into a progressive coding quest.

Return ONLY JSON matching this TypeScript shape:
{
  "projectName": string,
  "description": string,
  "levels": [{
    "id": string,
    "index": number,
    "title": string,
    "summary": string,
    "language": "javascript" | "html" | "css" | "typescript",
    "fileName": string,
    "boilerplate": string,
    "xpReward": number,
    "tasks": [{
      "id": string,
      "title": string,
      "description": string,
      "starterCode": string,
      "solutionHint": string[]
    }]
  }]
}

Rules:
- 4 to 5 levels, 1 to 2 tasks each
- Prefer javascript unless the project clearly needs html/css
- Every starterCode MUST include a line with "🟡 TASK:" describing what to implement
- starterCode should be incomplete on purpose so the learner finishes it
- solutionHint should be progressive nudges, not the full solution
- Keep each task small enough for a beginner

Learner prompt: ${JSON.stringify(prompt)}`);

  const text = result.response.text();
  const parsed = JSON.parse(text);
  const plan = normalizePlan(parsed, prompt);
  if (!plan.levels.length) throw new Error('Gemini returned no levels');
  return plan;
}

export async function geminiValidate(
  code: string,
  task: { title: string; description?: string; solutionHint?: string[] },
): Promise<ValidationResult & { errors?: { message: string; line: number }[] }> {
  const model = getModel();
  if (!model) throw new Error('GEMINI_API_KEY is not set');

  const result = await model.generateContent(`You are a supportive coding tutor checking one beginner task.
Decide if the learner's code meaningfully completes the task.

Return ONLY JSON:
{
  "correct": boolean,
  "feedback": string,
  "matchedTasks": string[],
  "errorLines": number[],
  "errorMessage": string | null,
  "errors": [{ "message": string, "line": number }]
}

Rules:
- correct=true only if the task looks done (task marker comments alone are NOT enough)
- If "🟡 TASK" markers remain and no real implementation was added, correct=false
- feedback should start with "Nice" when correct
- Be encouraging but honest
- errorLines are 1-based line numbers when possible

Task title: ${JSON.stringify(task.title)}
Task description: ${JSON.stringify(task.description || '')}
Hints: ${JSON.stringify(task.solutionHint || [])}
Learner code:
\`\`\`
${code}
\`\`\``);

  const parsed = JSON.parse(result.response.text());
  const correct = Boolean(parsed.correct);
  return {
    correct,
    feedback: String(
      parsed.feedback ||
        (correct
          ? `Nice work — "${task.title}" looks solid.`
          : `Not quite yet for "${task.title}". Keep going.`),
    ),
    matchedTasks: Array.isArray(parsed.matchedTasks)
      ? parsed.matchedTasks.map(String)
      : correct
        ? [task.title]
        : [],
    errorLines: Array.isArray(parsed.errorLines)
      ? parsed.errorLines.map(Number).filter((n: number) => Number.isFinite(n))
      : [],
    errorMessage: parsed.errorMessage == null ? undefined : String(parsed.errorMessage),
    errors: Array.isArray(parsed.errors)
      ? parsed.errors.map((e: any) => ({
          message: String(e?.message || 'Issue found'),
          line: Number(e?.line) || 1,
        }))
      : undefined,
  };
}

export async function geminiHint(
  task: { title: string; description?: string; solutionHint?: string[] },
  hintLevel: number,
): Promise<HintResult> {
  const model = getModel();
  if (!model) throw new Error('GEMINI_API_KEY is not set');

  const level = Math.max(1, Math.min(3, hintLevel));
  const result = await model.generateContent(`Give a beginner-friendly coding hint.
Return ONLY JSON: { "hint": string, "hintLevel": number }

hintLevel requested: ${level}
- Level 1: conceptual nudge
- Level 2: more concrete guidance
- Level 3: near-solution without dumping a full finished file

Task title: ${JSON.stringify(task.title)}
Task description: ${JSON.stringify(task.description || '')}
Built-in hints: ${JSON.stringify(task.solutionHint || [])}`);

  const parsed = JSON.parse(result.response.text());
  return {
    hint: String(parsed.hint || task.solutionHint?.[level - 1] || 'Try one small change at a time.'),
    hintLevel: Number(parsed.hintLevel) || level,
  };
}

export function hasGeminiKey() {
  return Boolean(clean(config.apiKey));
}
