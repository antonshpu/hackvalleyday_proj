# 🎮 Code Quest Tutor

Learn to code by playing a platformer. You describe a project ("Flappy Bird", "a todo app",
"a weather dashboard"...), Gemini breaks it into 5–8 levels of tasks, and you write real code
in a Monaco editor while a pixel-art hero jumps from platform to platform every time you get
a task right.

This repo is a **monorepo**: a Vite/React/TypeScript client and a small Express/TypeScript
server that proxies the Gemini API (so your API key never ships to the browser).

```
code-quest-tutor/
├── client/          # React + TS + Tailwind + Monaco + xterm.js
└── server/          # Express + TS, proxies Gemini, has a built-in mock mode
```

## Quick start (mock mode — no API keys needed)

Mock mode is **on by default**, so you can run and click through the entire app — project
breakdown, code checking, hints, the platformer, XP, level-up cutscenes — without any keys.

```bash
# from the repo root
cd server && npm install && npm run dev   # starts API on http://localhost:4000
```

In a second terminal:

```bash
cd client && npm install && npm run dev   # starts app on http://localhost:5173
```

Open http://localhost:5173. Type a project idea, hit enter, and start playing.

## Turning on the real Gemini API

1. Get a key at https://aistudio.google.com/app/apikey
2. `cd server && cp .env.example .env` and paste your key into `GEMINI_API_KEY`
3. Set `USE_MOCK=false` in `server/.env`
4. Restart the server (`npm run dev`)

The client never talks to Gemini directly — it always calls the local server at
`/api/*`, which is what keeps your key off the client bundle. `VITE_API_BASE_URL`
in `client/.env` controls where the client looks for that server (defaults to
`http://localhost:4000`).

## Firebase (auth + progress persistence)

Firebase is wired up but **optional** — if you don't configure it, progress is kept in
`localStorage` and everything still works. To enable real persistence:

1. Create a Firebase project → enable **Email/Password Auth** and **Firestore**.
2. Copy `client/.env.example` → `client/.env` and fill in the `VITE_FIREBASE_*` values
   from Project Settings → General → Your apps → SDK setup.
3. `client/src/services/firebase.ts` will automatically switch from the local-storage
   fallback to real Firestore reads/writes (see `hooks/useGameState.ts`).

## What's implemented

- **Screen 1 — Project Setup**: full-screen prompt, loading state with an animated
  "thinking" sprite, calls `/api/gemini/breakdown`.
- **Screen 2 — Coding Environment**:
  - Top bar: app name, XP, level, timer
  - Left (15%): file explorer generated from the project breakdown
  - Center (60%): Monaco editor, task lines highlighted yellow via decorations,
    boilerplate marked read-only, `// 🟡 TASK:` markers parsed automatically
  - Right (25%): platformer character + task checklist + Hint / Check Code / Resources
  - Bottom: live iframe preview (for HTML/JS projects) + an xterm.js terminal that
    "runs" your code and prints Gemini's feedback
- **Character system**: `IDLE / WALKING / JUMPING / FALLING / CELEBRATING / FAILING`
  states, CSS-driven pixel sprite, platform-to-platform progress bar, backflip
  cutscene on level completion.
- **Gemini integration** (server-side, mockable): project breakdown, code validation,
  progressive hints (won't give away the answer on hint #1).
- **Gamification**: XP counter, level counter, per-project achievements, persisted
  progress.

## Tech stack

React 18 + TypeScript, Vite, Tailwind CSS, `@monaco-editor/react`, `xterm` +
`xterm-addon-fit`, Express + TypeScript, `@google/generative-ai`, Firebase
(`firebase` client SDK, optional).

## Notes on scope

This is a complete, runnable scaffold covering every screen and system in the spec.
A couple of things worth knowing before you ship it:

- The live "preview" iframe executes the project's HTML/CSS/JS directly (sandboxed
  `iframe`), which is right for the Flappy-Bird-style canvas projects the app is
  built around. If you extend this to full Node/React projects you'd want to swap
  in something like StackBlitz's WebContainers instead of the iframe.
- The terminal is a **simulated** shell (it doesn't spawn a real process) — it pipes
  your code + Gemini's validation result through a typewriter-style xterm output.
  Wire it to a real sandboxed execution service if you want actual `node run.js`
  semantics.
- Code validation is intentionally a single Gemini call that returns structured JSON
  (`{ correct, feedback, hint }`) rather than an agentic loop, to keep latency low
  during a challenge.
