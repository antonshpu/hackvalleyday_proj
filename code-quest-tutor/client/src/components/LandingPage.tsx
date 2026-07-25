import { useState, type FormEvent } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (prompt: string) => void;
}

const EXAMPLES = ['Flappy Bird', 'a todo list app', 'a weather dashboard', 'Snake game'];

export default function LandingPage({ onSubmit }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* ambient pixel grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#242b3a 1px, transparent 1px), linear-gradient(90deg, #242b3a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 mb-6 text-gold">
          <Sparkles size={18} aria-hidden="true" />
          <span className="pixel-font text-[10px] tracking-wide">CODE QUEST TUTOR</span>
        </div>

        <h1 className="pixel-font text-2xl sm:text-3xl leading-relaxed text-ink mb-4">
          What do you want<br />to code today?
        </h1>
        <p className="text-dim font-mono text-sm mb-10">
          Describe a project. We'll turn it into levels — you write the code, your hero clears the stage.
        </p>

        <form onSubmit={handleSubmit} className="pixel-panel bg-panel rounded-sm p-2 flex items-center gap-2">
          <label htmlFor="project-prompt" className="sr-only">
            What do you want to code today?
          </label>
          <input
            id="project-prompt"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Flappy Bird"
            className="flex-1 bg-transparent px-4 py-4 font-mono text-ink placeholder:text-dim outline-none"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="pixel-font text-[10px] bg-xp text-void px-5 py-4 rounded-sm shadow-glowXp hover:brightness-110 active:translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            START
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-dim">
          <span>Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setValue(ex)}
              className="px-2 py-1 border border-border rounded-sm hover:border-xp hover:text-xp transition"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
