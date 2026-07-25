# Code Quest Tutor

A gamified coding tutor. Describe a project, get it broken into levels and
tasks, and complete each task in a real Monaco editor while a pixel-art
wizard advances across a platformer track.

## Run it

```bash
npm install
npm start
```

Opens at `http://localhost:5173`. Try prompts like **"Flappy Bird"** or
**"a todo app"** for hand-tuned level breakdowns, or anything else for a
generic 5-level scaffold.

## What's real vs. mocked right now

Per the brief, this ships with **mock Gemini responses** so the UI is fully
testable without an API key:

| Feature | Status |
|---|---|
| Monaco editor, task highlighting, read-only-feel boilerplate | ✅ Real |
| Platformer character (jump / fall / celebrate / cast / fail states) | ✅ Real |
| Live output preview (iframe) | ✅ Real |
| Terminal (xterm.js) | ✅ Real (local commands: `run`, `clear`, `help`) |
| XP / level tracking, saved to `localStorage` | ✅ Real |
| Project breakdown, code validation, hints | 🟡 Mocked — see `src/data/mockGemini.ts` |
| Firebase auth / cloud sync | ⬜ Not included — currently uses `localStorage` |

### Wiring up the real Gemini API

`src/data/mockGemini.ts` has three functions with the exact input/output
shape a real implementation should use:

- `mockBreakdownProject(prompt)` → `ProjectPlan`
- `mockValidateCode(code, task)` → `ValidationResult`
- `mockGenerateHint(task, hintLevel)` → `HintResult`

To go live:
1. Stand up a small Express server with routes like `POST /api/gemini/breakdown`.
2. Call the Gemini API from that route only — **never put your API key in
   the client**.
3. Replace the body of each mock function with a `fetch()` to your route,
   keeping the same return shape.

### Wiring up Firebase

Swap `useGameState` (`src/hooks/useGameState.ts`) to write to Firestore
instead of `localStorage`, keyed by the authenticated user's UID. The hook's
public interface (`state`, `setCharacterState`, `awardXpAndAdvance`,
`resetProgress`) can stay the same.

## Character states

The wizard sprite sheet you provided was split into these states
(`src/assets/sprites/`, mapped in `src/components/CharacterSprite.tsx`):

- `IDLE` — standing, staff planted
- `WALKING` — 3-frame cycle, steps between platforms
- `JUMPING` — arcs forward on a correct answer
- `FALLING` — slides back on a wrong answer
- `CASTING` — blue orb, used while a hint/check is loading
- `CELEBRATING` — sparkle backflip, used on level/quest complete
- `FAILING` — crouched reaction, brief flash on an incorrect check

## Stack

React + TypeScript + Vite, Tailwind CSS, `@monaco-editor/react`, `xterm.js`.
