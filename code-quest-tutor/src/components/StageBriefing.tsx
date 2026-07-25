import type { Level } from '../types';

interface Props {
  level: Level;
  onStart: () => void;
}

export function StageBriefing({ level, onStart }: Props) {
  return (
    <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-4 flex flex-col h-full">
      <span className="inline-block self-start -mt-1 mb-2 bg-gold-500 text-ink-950 font-pixel text-[9px] px-3 py-1.5 rounded shadow-pixel">
        STAGE {level.index + 1}
      </span>
      <h2 className="text-parchment-100 text-lg font-semibold leading-snug">{level.title}</h2>
      <p className="mt-1.5 text-xs text-parchment-300/70 leading-relaxed">{level.summary}</p>

      <div className="mt-4 pt-3 border-t border-ink-700">
        <span className="font-pixel text-[9px] text-parchment-300/60 tracking-wider">
          OBJECTIVES
        </span>
        <ul className="mt-2 space-y-1.5">
          {level.tasks.map((task) => (
            <li key={task.id} className="flex items-start gap-2 text-xs text-parchment-200">
              <span className="text-gold-400 shrink-0" aria-hidden>
                ⭐
              </span>
              {task.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-3 border-t border-ink-700">
        <span className="font-pixel text-[9px] text-parchment-300/60 tracking-wider">REWARD</span>
        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-gold-300">
            <span aria-hidden>⭐</span> {level.xpReward}
          </span>
          <span className="flex items-center gap-1.5 text-parchment-200">
            <span aria-hidden>🍞</span> x1
          </span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-auto pt-5 w-full bg-gold-500 hover:bg-gold-400 text-ink-950 font-pixel text-[11px] py-3.5 rounded-md shadow-pixel transition-colors retro-focus"
      >
        START
      </button>
    </div>
  );
}
