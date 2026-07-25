import type { Level } from '../types';

interface Props {
  levels: Level[];
  currentLevelIndex: number;
}

export function FileExplorer({ levels, currentLevelIndex }: Props) {
  return (
    <aside className="h-full overflow-y-auto">
      <div className="px-3 py-2.5 border-b-[3px] border-[#8b4e24]/80">
        <span className="font-pixel text-[9px] text-[#5c3a22] tracking-wider">PROJECT FILES</span>
      </div>
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-mono text-[#7a5230] flex items-center gap-1.5">
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
                      ? 'bg-[#c47a3a]/25 text-[#3b2415] border-l-[3px] border-[#8b4e24] font-semibold'
                      : 'text-[#7a5230] border-l-[3px] border-transparent'
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
