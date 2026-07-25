import type { HintResult, Level, ProjectPlan, ValidationResult } from '../types';

/**
 * ---------------------------------------------------------------------------
 * GEMINI LAYER (real API with mock fallback)
 * ---------------------------------------------------------------------------
 * When GEMINI_API_KEY is set in `.env`, these call the Vite `/api/gemini/*`
 * middleware. If the key is missing or a request fails, they fall back to
 * the local mock responses so the UI still works offline.
 * ---------------------------------------------------------------------------
 */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function apiPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn(`[gemini] ${path} failed:`, err.error || res.statusText);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[gemini] ${path} unreachable:`, err);
    return null;
  }
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// A handful of hand-authored templates so the demo feels alive without a
// real model. Falls back to a generic "game" template for anything else.
const TEMPLATES: Record<string, (name: string) => ProjectPlan> = {
  flappy: (name) => ({
    projectName: name,
    description:
      'A side-scrolling arcade game where a bird flaps through a gap in pipes.',
    levels: [
      lvl(0, 'Set Up the Canvas', 'canvas.js', 'javascript', [
        task(
          'Create the canvas',
          'Add a <canvas> element sized 320x480 and grab its 2D context.',
          `const canvas = document.getElementById('game');\n// 🟡 TASK: set canvas.width to 320 and canvas.height to 480\n\nconst ctx = canvas.getContext('2d');`,
          ['Look for a `.width` and `.height` property on the canvas element.']
        ),
      ]),
      lvl(1, 'Draw the Bird', 'bird.js', 'javascript', [
        task(
          'Create the bird object',
          'Define a bird object with x, y, velocity and gravity.',
          `// 🟡 TASK: create a "bird" object with x, y, velocity, and gravity properties\nconst bird = {\n\n};`,
          ['A plain object literal with four numeric properties is enough.']
        ),
        task(
          'Draw the bird',
          'Draw the bird as a yellow circle at its x/y position.',
          `function drawBird() {\n  ctx.fillStyle = 'yellow';\n  // 🟡 TASK: use ctx.beginPath(), ctx.arc(), and ctx.fill() to draw the bird\n}`,
          ['ctx.arc(x, y, radius, 0, Math.PI * 2) draws a full circle.']
        ),
      ]),
      lvl(2, 'Gravity & Flap', 'physics.js', 'javascript', [
        task(
          'Apply gravity',
          'Each frame, increase bird.velocity by gravity and add it to bird.y.',
          `function update() {\n  // 🟡 TASK: bird.velocity += bird.gravity; bird.y += bird.velocity;\n}`,
          ['Two lines: update velocity first, then position.']
        ),
        task(
          'Flap on click',
          'On click/space, set bird.velocity to a negative "flap" value.',
          `document.addEventListener('keydown', (e) => {\n  if (e.code === 'Space') {\n    // 🟡 TASK: set bird.velocity to -6\n  }\n});`,
          ['A negative velocity moves the bird upward.']
        ),
      ]),
      lvl(3, 'Pipes', 'pipes.js', 'javascript', [
        task(
          'Spawn pipes',
          'Create a function that adds a new pipe pair with a random gap.',
          `function spawnPipe() {\n  // 🟡 TASK: push { x: canvas.width, gapY: Math.random() * 200 + 100 } to pipes[]\n}`,
          ['pipes.push({ ... }) with a randomized gapY works well.']
        ),
        task(
          'Move & draw pipes',
          'Move each pipe left every frame and draw it as green rectangles.',
          `function updatePipes() {\n  // 🟡 TASK: subtract a speed value from each pipe.x, then draw top/bottom rects\n}`,
          ['pipe.x -= 2; then two ctx.fillRect calls, above and below the gap.']
        ),
      ]),
      lvl(4, 'Collision & Score', 'collision.js', 'javascript', [
        task(
          'Detect collisions',
          'Return true if the bird overlaps a pipe or the ground/ceiling.',
          `function checkCollision() {\n  // 🟡 TASK: compare bird.y and pipe.x/gapY to detect overlap\n  return false;\n}`,
          ['Compare bird.y against 0/canvas.height first — that catches most bugs.']
        ),
        task(
          'Increase score',
          'When a pipe passes the bird\'s x position, increment score by 1.',
          `let score = 0;\nfunction updateScore() {\n  // 🟡 TASK: increment score when pipe.x + pipeWidth < bird.x\n}`,
          ['Track a "scored" flag per pipe so it only counts once.']
        ),
      ]),
    ],
  }),
  todo: (name) => ({
    projectName: name,
    description: 'A to-do list app with add, complete, and delete actions.',
    levels: [
      lvl(0, 'Render the List', 'app.js', 'javascript', [
        task(
          'Create the state array',
          'Define an array called `todos` to hold task strings.',
          `// 🟡 TASK: create an empty array called todos\n`,
          ['const todos = [];']
        ),
        task(
          'Render todos to the DOM',
          'Loop over todos and append an <li> for each one to the list element.',
          `function render() {\n  list.innerHTML = '';\n  // 🟡 TASK: loop over todos and create an <li> for each\n}`,
          ['todos.forEach((t) => { const li = document.createElement("li"); ... })']
        ),
      ]),
      lvl(1, 'Add Todos', 'add.js', 'javascript', [
        task(
          'Handle form submit',
          'Prevent default form submission and read the input value.',
          `form.addEventListener('submit', (e) => {\n  // 🟡 TASK: call e.preventDefault() and read input.value\n});`,
          ['e.preventDefault() first, always.']
        ),
        task(
          'Push and re-render',
          'Push the new todo into the array and call render() again.',
          `// 🟡 TASK: push the trimmed input value into todos, then call render()\n`,
          ['Trim the string so empty submissions are ignored.']
        ),
      ]),
      lvl(2, 'Complete & Delete', 'actions.js', 'javascript', [
        task(
          'Toggle completed',
          'Clicking a todo should toggle a `done` boolean on that item.',
          `// 🟡 TASK: change todos from strings to { text, done } objects and toggle done on click\n`,
          ['Store objects instead of plain strings so state can travel with each item.']
        ),
        task(
          'Delete a todo',
          'Clicking a delete button removes that item from the array.',
          `// 🟡 TASK: use Array.prototype.filter to remove the clicked todo by index\n`,
          ['todos = todos.filter((_, i) => i !== indexToRemove)']
        ),
      ]),
    ],
  }),
};

function task(
  title: string,
  description: string,
  starterCode: string,
  solutionHint: string[]
) {
  return {
    id: slug(title) + '-' + Math.random().toString(36).slice(2, 6),
    title,
    description,
    starterCode,
    solutionHint,
    taskMarker: '🟡 TASK',
    completed: false,
  };
}

function lvl(
  index: number,
  title: string,
  fileName: string,
  language: Level['language'],
  tasks: ReturnType<typeof task>[]
): Level {
  return {
    id: `level-${index}`,
    index,
    title,
    summary: `Level ${index + 1}: ${title}`,
    language,
    fileName,
    boilerplate: tasks.map((t) => t.starterCode).join('\n\n'),
    tasks,
    xpReward: 100 + index * 25,
    completed: false,
  };
}

function genericPlan(name: string): ProjectPlan {
  return {
    projectName: name,
    description: `A guided build of "${name}", broken into progressive coding levels.`,
    levels: [
      lvl(0, 'Project Scaffold', 'index.js', 'javascript', [
        task(
          'Set up the entry point',
          `Create the main function that will bootstrap "${name}".`,
          `// 🟡 TASK: write a function called main() that logs a startup message\n`,
          ['A single console.log inside a named function is enough to start.']
        ),
      ]),
      lvl(1, 'Core Data Model', 'model.js', 'javascript', [
        task(
          'Define the core state',
          `Model the primary data structure that "${name}" needs to track.`,
          `// 🟡 TASK: define an object or class representing the core state\n`,
          ['Start with the smallest set of fields the feature truly needs.']
        ),
      ]),
      lvl(2, 'Core Interaction', 'interaction.js', 'javascript', [
        task(
          'Wire up the main interaction',
          'Handle the primary user action (click, submit, or keypress).',
          `// 🟡 TASK: add an event listener for the main interaction\n`,
          ['addEventListener is the standard hook for user interaction.']
        ),
      ]),
      lvl(3, 'Feedback & Polish', 'ui.js', 'javascript', [
        task(
          'Reflect state changes in the UI',
          'Update the DOM whenever the core state changes.',
          `// 🟡 TASK: write a render() function that reflects current state\n`,
          ['Keep render() pure — it should only read state, never mutate it.']
        ),
      ]),
      lvl(4, 'Edge Cases', 'validation.js', 'javascript', [
        task(
          'Guard against invalid input',
          'Add a validation check before the main action runs.',
          `// 🟡 TASK: return early if the input is empty or invalid\n`,
          ['An early `if (!value) return;` avoids most edge-case bugs.']
        ),
      ]),
    ],
  };
}

export async function mockBreakdownProject(prompt: string): Promise<ProjectPlan> {
  const live = await apiPost<ProjectPlan>('/api/gemini/breakdown', { prompt });
  if (live?.levels?.length) return live;

  await wait(1400);
  const lower = prompt.toLowerCase();
  if (lower.includes('flappy')) return TEMPLATES.flappy(prompt);
  if (lower.includes('todo') || lower.includes('to-do')) return TEMPLATES.todo(prompt);
  return genericPlan(prompt);
}

export async function mockValidateCode(
  code: string,
  task: { title: string; description?: string; solutionHint: string[] }
): Promise<ValidationResult> {
  const live = await apiPost<ValidationResult>('/api/gemini/validate', { code, task });
  if (live && typeof live.correct === 'boolean') return live;

  await wait(700);
  // Heuristic "validator": correct if the task marker comment was removed
  // or replaced with real code (more than just whitespace/comment).
  const withoutMarkerLine = code
    .split('\n')
    .filter((line) => !line.includes('🟡 TASK'))
    .join('\n');
  const meaningfulLines = withoutMarkerLine
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('//'));

  const lines = code.split('\n');
  const taskMarkerLines = lines
    .map((line, idx) => ({ line, idx }))
    .filter(({ line }) => line.includes('🟡 TASK'))
    .map(({ idx }) => idx + 1);

  const correct = meaningfulLines.length >= 2 && taskMarkerLines.length === 0;

  const errorLines = taskMarkerLines.map((markerLine) => {
    for (let i = markerLine; i < lines.length; i += 1) {
      const trimmed = lines[i].trim();
      if (trimmed.length === 0 || trimmed.startsWith('//')) continue;
      return i + 1;
    }
    return markerLine;
  });

  return {
    correct,
    feedback: correct
      ? `Nice work — "${task.title}" looks solid. Logic checks out.`
      : task.title.toLowerCase().includes('canvas')
      ? `Not quite yet. Your app still has a placeholder comment instead of actually creating the canvas and sizing it.`
      : `Not quite yet. Your app still has a placeholder comment instead of real implementation for "${task.title}".`,
    matchedTasks: correct ? [task.title] : [],
    errorLines: correct ? [] : errorLines.length > 0 ? errorLines : taskMarkerLines,
    errorMessage: correct
      ? undefined
      : task.title.toLowerCase().includes('canvas')
      ? `App critique: create a <canvas> element and set its width/height before calling getContext('2d').`
      : `Implementation issue: replace the task marker with working code for "${task.title}".`,
    errors: correct
      ? undefined
      : (errorLines.length > 0 ? errorLines : taskMarkerLines).map((line) => ({
          line,
          message: 'Replace the task marker with working code.',
        })),
  };
}

export async function mockGenerateHint(
  task: { title: string; description?: string; solutionHint: string[] },
  hintLevel: number
): Promise<HintResult> {
  const live = await apiPost<HintResult>('/api/gemini/hint', { task, hintLevel });
  if (live?.hint) return live;

  await wait(600);
  const hints = task.solutionHint;
  const idx = Math.min(hintLevel, hints.length - 1);
  return {
    hint: hints[idx] ?? `Re-read the task description for "${task.title}" and break it into one small step at a time.`,
    hintLevel: idx,
  };
}
