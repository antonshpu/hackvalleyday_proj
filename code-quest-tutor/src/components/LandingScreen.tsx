import { useState } from 'react';
import { CharacterSprite } from './CharacterSprite';

interface Props {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function LandingScreen({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-ink-900 relative overflow-hidden px-6">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:radial-gradient(circle,_#D4A24C_1px,_transparent_1px)] [background-size:26px_26px]" />

      <p className="font-pixel text-[10px] text-arcane-400 tracking-widest mb-6">
        A GUIDED QUEST FOR NEW CODERS
      </p>
      <h1 className="font-pixel text-gold-400 text-2xl md:text-3xl text-center leading-relaxed mb-2">
        CODE QUEST TUTOR
      </h1>
      <p className="text-parchment-300 text-sm mb-10 text-center max-w-md">
        Describe what you want to build. Your wizard guide will break it into
        levels, platform by platform.
      </p>

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <CharacterSprite state="CASTING" size={128} />
          <p className="font-mono text-arcane-300 text-sm animate-pulse">
            Conjuring your quest map…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <label htmlFor="project-prompt" className="sr-only">
            What do you want to code today?
          </label>
          <input
            id="project-prompt"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="What do you want to code today? e.g. Flappy Bird"
            className="w-full bg-ink-800 border-2 border-gold-600 focus:border-gold-400 rounded-md px-5 py-4 text-parchment-100 placeholder:text-parchment-300/40 text-base font-body outline-none retro-focus"
            autoFocus
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="mt-4 w-full bg-gold-500 hover:bg-gold-400 disabled:bg-ink-600 disabled:text-parchment-300/40 disabled:cursor-not-allowed text-ink-950 font-pixel text-[11px] py-4 rounded-md shadow-pixel transition-colors retro-focus"
          >
            BEGIN QUEST
          </button>
        </form>
      )}
    </div>
  );
}
