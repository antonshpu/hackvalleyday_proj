import type { ProjectBreakdown } from '../types';

/**
 * Fallback breakdown used if the server is unreachable, or for instant local
 * demoing. The real breakdown comes from POST /api/gemini/breakdown.
 */
export const FLAPPY_BIRD_MOCK: ProjectBreakdown = {
  projectName: 'Flappy Bird',
  description:
    'A canvas-based side-scroller where a bird flaps through gaps in pipes.',
  files: [
    { name: 'index.html', path: 'index.html', language: 'html' },
    { name: 'game.js', path: 'game.js', language: 'javascript' },
    { name: 'style.css', path: 'style.css', language: 'css' },
  ],
  levels: [
    {
      id: 'lvl-1',
      title: 'Level 1 — Set the Stage',
      summary: 'Create the canvas and drawing loop.',
      fileName: 'game.js',
      completed: false,
      starterCode: `const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

// 🟡 TASK: write a draw() function that clears the canvas each frame
// using ctx.clearRect(0, 0, canvas.width, canvas.height)


function loop() {
  draw();
  requestAnimationFrame(loop);
}
loop();`,
      tasks: [
        {
          id: 't1',
          description: 'Write a draw() function that clears the canvas every frame.',
          marker: '// 🟡 TASK: write a draw() function',
          completed: false,
          hintsUsed: 0,
        },
      ],
    },
    {
      id: 'lvl-2',
      title: 'Level 2 — The Bird',
      summary: 'Add a bird object with position and gravity.',
      fileName: 'game.js',
      completed: false,
      starterCode: `const bird = {
  x: 60,
  y: 200,
  velocity: 0,
  gravity: 0.4,
};

// 🟡 TASK: in the update() function, apply gravity to the bird
// bird.velocity += bird.gravity; bird.y += bird.velocity;
function update() {

}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f0d264';
  ctx.fillRect(bird.x, bird.y, 20, 20);
}`,
      tasks: [
        {
          id: 't2',
          description: 'Apply gravity to the bird inside update().',
          marker: '// 🟡 TASK: in the update() function, apply gravity',
          completed: false,
          hintsUsed: 0,
        },
      ],
    },
    {
      id: 'lvl-3',
      title: 'Level 3 — Flap Controls',
      summary: 'Make the bird flap upward on spacebar / click.',
      fileName: 'game.js',
      completed: false,
      starterCode: `window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    // 🟡 TASK: give the bird a negative velocity so it flaps upward
    // e.g. bird.velocity = -6;

  }
});`,
      tasks: [
        {
          id: 't3',
          description: 'Give the bird an upward flap on spacebar press.',
          marker: '// 🟡 TASK: give the bird a negative velocity',
          completed: false,
          hintsUsed: 0,
        },
      ],
    },
    {
      id: 'lvl-4',
      title: 'Level 4 — Pipes',
      summary: 'Spawn and scroll pipe obstacles across the screen.',
      fileName: 'game.js',
      completed: false,
      starterCode: `const pipes = [];

function spawnPipe() {
  // 🟡 TASK: push a new pipe object with a random gap position
  // { x: canvas.width, gapY: Math.random() * 250 + 80 }

}

function updatePipes() {
  pipes.forEach((p) => (p.x -= 2));
}`,
      tasks: [
        {
          id: 't4',
          description: 'Spawn a pipe with a random gap position.',
          marker: '// 🟡 TASK: push a new pipe object',
          completed: false,
          hintsUsed: 0,
        },
      ],
    },
    {
      id: 'lvl-5',
      title: 'Level 5 — Collisions',
      summary: 'Detect when the bird hits a pipe or the ground.',
      fileName: 'game.js',
      completed: false,
      starterCode: `function checkCollision() {
  // 🟡 TASK: return true if bird.y > canvas.height or bird.y < 0


}`,
      tasks: [
        {
          id: 't5',
          description: 'Detect ground/ceiling collisions.',
          marker: '// 🟡 TASK: return true if bird.y',
          completed: false,
          hintsUsed: 0,
        },
      ],
    },
    {
      id: 'lvl-6',
      title: 'Level 6 — Score',
      summary: 'Track and display the score as pipes are passed.',
      fileName: 'game.js',
      completed: false,
      starterCode: `let score = 0;

function drawScore() {
  // 🟡 TASK: draw the score in the top-left using ctx.fillText


}`,
      tasks: [
        {
          id: 't6',
          description: 'Render the current score onto the canvas.',
          marker: '// 🟡 TASK: draw the score',
          completed: false,
          hintsUsed: 0,
        },
      ],
    },
  ],
};
