import { useState } from 'react';
import { CharacterSprite } from './CharacterSprite';

interface Props {
  name: string;
  level: number;
  onExitToHome: () => void;
  onResetProgress: () => void;
}

export function StatusFooter({ name, level, onExitToHome, onResetProgress }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <footer className="relative shrink-0 h-16 flex items-center gap-4 px-4 bread-loaf !rounded-none border-x-0 border-b-0">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-9 h-9 rounded-md bg-[#f8edd4] border-[3px] border-[#8b4e24] flex items-center justify-center overflow-hidden">
          <CharacterSprite state="IDLE" size={28} />
        </div>
        <div className="leading-tight">
          <div className="text-xs text-[#3b2415] font-semibold">{name}</div>
          <div className="text-[10px] text-[#5c3a22] flex items-center gap-1">
            <span aria-hidden>⭐</span> Level {level}
          </div>
        </div>
      </div>

      <div className="relative shrink-0 ml-auto">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="bg-[#f0d264] hover:brightness-105 text-[#3b2415] font-pixel text-[10px] px-4 py-2.5 rounded-md border-[3px] border-[#8b4e24] shadow-[2px_2px_0_#5c3a22] transition-colors retro-focus flex items-center gap-1.5"
        >
          MENU <span aria-hidden>☰</span>
        </button>
        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-52 bread-loaf overflow-hidden animate-pop-in !rounded-xl">
            <button
              onClick={() => {
                setMenuOpen(false);
                onExitToHome();
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-[#3b2415] hover:bg-[#c47a3a]/20 font-medium"
            >
              🏠 Save &amp; exit to home
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onResetProgress();
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-[#a33b2a] hover:bg-[#c47a3a]/20 border-t-[3px] border-[#8b4e24]/40 font-medium"
            >
              ♻️ Reset progress
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
