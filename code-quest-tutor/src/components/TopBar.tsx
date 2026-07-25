import { useEffect, useState } from 'react';

interface Props {
  projectName: string;
  xp: number;
  levelLabel: string;
  startedAt: number;
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function TopBar({ projectName, xp, levelLabel, startedAt }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 shrink-0 bg-ink-800 border-b-2 border-ink-600 flex items-center justify-between px-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-pixel text-[10px] text-gold-400 whitespace-nowrap">
          CODE QUEST
        </span>
        <span className="text-parchment-300/50">/</span>
        <span className="text-sm text-parchment-200 truncate max-w-[220px]">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-5 font-mono text-xs">
        <div className="flex items-center gap-1.5 text-gold-300">
          <span aria-hidden>⭐</span>
          <span>{xp} XP</span>
        </div>
        <div className="flex items-center gap-1.5 text-arcane-300">
          <span aria-hidden>🗺️</span>
          <span>{levelLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 text-parchment-300">
          <span aria-hidden>⏱️</span>
          <span>{formatElapsed(now - startedAt)}</span>
        </div>
      </div>
    </header>
  );
}
