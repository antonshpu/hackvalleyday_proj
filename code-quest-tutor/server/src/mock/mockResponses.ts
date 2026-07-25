interface Task {
  id: string;
  description: string;
  marker: string;
  completed: boolean;
  hintsUsed: number;
}

interface Level {
  id: string;
  title: string;
  summary: string;
  tasks: Task[];
  starterCode: string;
  fileName: string;
  completed: boolean;
}

const TEMPLATE_STEPS = [
  { title: 'Set the Stage', task: 'Set up the basic structure and entry point.' },
  { title: 'Core Data', task: 'Model the main piece of state your project needs.' },
  { title: 'First Interaction', task: 'Wire up the first user interaction (click, key, or input).' },
  { title: 'Update Loop', task: 'Write the function that updates state over time or on events.' },
  { title: 'Render It', task: 'Draw or render the current state to the screen.' },
  { title: 'Rules & Feedback', task: 'Add the core rule/logic that makes this project actually work.' },
  { title: 'Polish', task: 'Add a score, message, or visual polish to finish the project.' },
];

export function mockBreakdown(prompt: string) {
  const name = prompt.trim() || 'My Project';
  const stepCount = 6;
  const levels: Level[] = TEMPLATE_STEPS.slice(0, stepCount).map((step, i) => {
    const taskId = `t${i + 1}`;
    const marker = `// 🟡 TASK: ${step.task}`;
    return {
      id: `lvl-${i + 1}`,
      title: `Level ${i + 1} — ${step.title}`,
      summary: step.task,
      fileName: 'main.js',
      completed: false,
      starterCode: `// ${name} — ${step.title}\n${marker}\n\n\nfunction step${i + 1}() {\n  // your code above will be graded against this step\n}\n`,
      tasks: [
        {
          id: taskId,
          description: step.task,
          marker,
          completed: false,
          hintsUsed: 0,
        },
      ],
    };
  });

  return {
    projectName: name,
    description: `A step-by-step build of "${name}", broken into ${stepCount} levels.`,
    files: [
      { name: 'index.html', path: 'index.html', language: 'html' },
      { name: 'main.js', path: 'main.js', language: 'javascript' },
      { name: 'style.css', path: 'style.css', language: 'css' },
    ],
    levels,
  };
}

export function mockValidate(code: string, taskDescription: string) {
  const trimmed = code.trim();
  // Simple heuristic: the task marker line removed leaves *some* real code,
  // and it's not just a comment.
  const meaningfulLines = trimmed
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('//'));
  const correct = meaningfulLines.length >= 2;

  return {
    correct,
    confidence: correct ? 0.8 : 0.3,
    feedback: correct
      ? `Nice — that satisfies "${taskDescription}". Moving to the next task.`
      : `Not quite yet for "${taskDescription}". Add the logic described in the TASK comment.`,
  };
}

export function mockHint(taskDescription: string, hintLevel: number) {
  const hints = [
    `Start by re-reading exactly what "${taskDescription}" is asking — name the one function or variable it points to.`,
    `Look for an existing pattern nearby in the file and mirror its shape for this task.`,
    `Try the smallest possible version: one or two lines that directly do "${taskDescription}", then run Check Code.`,
  ];
  return { hint: hints[Math.min(hintLevel, hints.length - 1)], hintLevel };
}
