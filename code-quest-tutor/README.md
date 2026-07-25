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

| Feature | Status |
|---|---|
| Monaco editor, task highlighting, read-only-feel boilerplate | ✅ Real |
| Platformer character (jump / fall / celebrate / cast / fail states) | ✅ Real |
| Live output preview (iframe) | ✅ Real |
| Terminal (xterm.js) | ✅ Real (local commands: `run`, `clear`, `help`) |
| XP / level tracking, saved to `localStorage` | ✅ Real |
| Project breakdown, code validation, hints | ✅ Gemini when `GEMINI_API_KEY` is set; otherwise mock fallback |
| Firebase auth / cloud sync | ⬜ Not included — currently uses `localStorage` |

### Wiring up the Gemini API

1. Create `code-quest-tutor/.env` from the example:

```bash
cp .env.example .env
```

2. Paste your key from [Google AI Studio](https://aistudio.google.com/apikey):

```
GEMINI_API_KEY=your_real_key_here
```

3. Restart the dev server (`npm start`). The key stays on the Vite server
   (`/api/gemini/*`) and is never shipped to the browser.

If the key is missing or a request fails, the app automatically falls back
to `src/data/mockGemini.ts` mock responses.

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
