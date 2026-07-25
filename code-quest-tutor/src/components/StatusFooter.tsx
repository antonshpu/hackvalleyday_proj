import { useState } from 'react';
import { CharacterSprite } from './CharacterSprite';

interface Props {
  name: string;
  level: number;
  onExitToHome: () => void;
  onResetProgress: () => void;
}

export function StatusFooter({
  name,
  level,
  onExitToHome,
  onResetProgress,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

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
