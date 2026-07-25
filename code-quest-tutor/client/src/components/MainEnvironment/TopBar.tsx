import { Trophy, Zap, Clock } from 'lucide-react';

interface Props {
  projectName: string;
  xp: number;
  levelNumber: number;
  totalLevels: number;
  elapsedSeconds: number;
}

function formatTime(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function TopBar({ projectName, xp, levelNumber, totalLevels, elapsedSeconds }: Props) {
  return (
    <header className="h-14 shrink-0 bg-panel border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2 min-w-0">
        <span className="pixel-font text-[10px] text-gold">CQT</span>
        <span className="font-mono text-sm text-ink truncate">{projectName}</span>
      </div>

      <div className="flex items-center gap-5 font-mono text-sm">
        <div className="flex items-center gap-1.5 text-xp" title="Experience points">
          <Zap size={15} aria-hidden="true" />
          <span>{xp} XP</span>
        </div>
        <div className="flex items-center gap-1.5 text-gold" title="Current level">
          <Trophy size={15} aria-hidden="true" />
          <span>
            Level {levelNumber}/{totalLevels}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-dim" title="Time on task">
          <Clock size={15} aria-hidden="true" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>
    </header>
  );
}
