import type { Level } from '../types';

interface Props {
  levels: Level[];
  currentLevelIndex: number;
}

export function FileExplorer({ levels, currentLevelIndex }: Props) {
  return (
    <aside className="h-full bg-ink-800 border-r-2 border-ink-600 overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-ink-700">
        <span className="font-pixel text-[9px] text-parchment-300/70 tracking-wider">
          PROJECT FILES
        </span>
      </div>
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-mono text-parchment-300/60 flex items-center gap-1.5">
          <span aria-hidden>📁</span> src
        </div>
        <ul>
          {levels.map((level, i) => {
            const isCurrent = i === currentLevelIndex;
            const isDone = level.completed;
            return (
              <li key={level.id}>
                <div
                  className={`flex items-center gap-1.5 pl-7 pr-3 py-1.5 text-xs font-mono cursor-default ${
                    isCurrent
                      ? 'bg-gold-500/10 text-gold-300 border-l-2 border-gold-400'
                      : 'text-parchment-300/70 border-l-2 border-transparent'
                  }`}
                >
                  <span aria-hidden>{isDone ? '✅' : '📄'}</span>
                  <span className="truncate">{level.fileName}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
