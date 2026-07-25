import type { HintResult, Level, ProjectPlan, ValidationResult } from '../types';

/**
 * ---------------------------------------------------------------------------
 * MOCK GEMINI LAYER
 * ---------------------------------------------------------------------------
 * These three functions stand in for real calls to the Gemini API. Each one
 * mirrors the exact shape/contract a real implementation should return, so
 * swapping in the real API later only means replacing the function body.
 *
 * To wire up the real API:
 *  1. Create a `/api/gemini/breakdown`, `/api/gemini/validate`, and
 *     `/api/gemini/hint` route on an Express server (see README).
 *  2. Replace the body of each function below with a `fetch()` call to that
 *     route, keeping the same input/output types.
 *  3. Store your GEMINI_API_KEY server-side only — never in the client.
 * ---------------------------------------------------------------------------
 */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  await wait(1400);
  const lower = prompt.toLowerCase();
  if (lower.includes('flappy')) return TEMPLATES.flappy(prompt);
  if (lower.includes('todo') || lower.includes('to-do')) return TEMPLATES.todo(prompt);
  return genericPlan(prompt);
}

export async function mockValidateCode(
  code: string,
  task: { title: string; solutionHint: string[] }
): Promise<ValidationResult> {
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

  const correct = meaningfulLines.length >= 2;

  return {
    correct,
    feedback: correct
      ? `Nice work — "${task.title}" looks solid. Logic checks out.`
      : `Not quite yet. The task comment is still there and no real implementation was added for "${task.title}".`,
    matchedTasks: correct ? [task.title] : [],
  };
}

export async function mockGenerateHint(
  task: { title: string; solutionHint: string[] },
  hintLevel: number
): Promise<HintResult> {
  await wait(600);
  const hints = task.solutionHint;
  const idx = Math.min(hintLevel, hints.length - 1);
  return {
    hint: hints[idx] ?? `Re-read the task description for "${task.title}" and break it into one small step at a time.`,
    hintLevel: idx,
  };
}
