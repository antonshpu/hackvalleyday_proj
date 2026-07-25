import { useState } from 'react';
import { CharacterSprite } from './CharacterSprite';

interface Props {
  name: string;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  projects: number;
  streak: number;
  onExitToHome: () => void;
  onResetProgress: () => void;
}

export function StatusFooter({
  name,
  level,
  xpIntoLevel,
  xpForNextLevel,
  projects,
  streak,
  onExitToHome,
  onResetProgress,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pct = Math.min(100, (xpIntoLevel / xpForNextLevel) * 100);

  return (
    <footer className="relative shrink-0 h-16 flex items-center gap-4 px-4 bg-ink-800 border-t-2 border-ink-600">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-9 h-9 rounded bg-ink-700 flex items-center justify-center overflow-hidden">
          <CharacterSprite state="IDLE" size={28} />
        </div>
        <div className="leading-tight">
          <div className="text-xs text-parchment-100 font-medium">{name}</div>
          <div className="text-[10px] text-gold-400 flex items-center gap-1">
            <span aria-hidden>⭐</span> Level {level}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-[120px] flex items-center gap-2">
        <span className="font-pixel text-[8px] text-parchment-300/60 tracking-wider">XP</span>
        <div className="flex-1 h-2.5 bg-ink-600 rounded-full overflow-hidden">
          <div className="h-full bg-gold-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-[10px] text-parchment-300/60 whitespace-nowrap">
          {xpIntoLevel} / {xpForNextLevel}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-parchment-200 shrink-0">
        <span aria-hidden>🍞</span>
        <span className="font-mono">{projects}</span>
        <span className="font-pixel text-[8px] text-parchment-300/50 ml-1">PROJECTS</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-ember-400 shrink-0">
        <span aria-hidden>🔥</span>
        <span className="font-mono">{streak}</span>
        <span className="font-pixel text-[8px] text-parchment-300/50 ml-1">STREAK</span>
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="bg-gold-500 hover:bg-gold-400 text-ink-950 font-pixel text-[10px] px-4 py-2.5 rounded-md shadow-pixel transition-colors retro-focus flex items-center gap-1.5"
        >
          MENU <span aria-hidden>☰</span>
        </button>
        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-ink-800 border-2 border-ink-600 rounded-md shadow-pixel overflow-hidden animate-pop-in">
            <button
              onClick={() => {
                setMenuOpen(false);
                onExitToHome();
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-parchment-100 hover:bg-ink-700"
            >
              🏠 Save &amp; exit to home
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onResetProgress();
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-ember-400 hover:bg-ink-700 border-t border-ink-700"
            >
              ♻️ Reset progress
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
