interface Props {
  totalStages: number;
  currentStageIndex: number;
  rewardStars?: number;
}

export function PlatformProgressBar({ totalStages, currentStageIndex, rewardStars = 3 }: Props) {
  return (
    <div className="shrink-0 flex items-center gap-4 px-4 py-3 bg-ink-800 border-b-2 border-ink-600">
      <span className="font-pixel text-[9px] text-gold-400 tracking-wider whitespace-nowrap flex items-center gap-1.5">
        <span aria-hidden>🚩</span> PLATFORM PROGRESS
      </span>

      <div className="flex-1 flex items-center">
        {Array.from({ length: totalStages }).map((_, i) => {
          const done = i < currentStageIndex;
          const current = i === currentStageIndex;
          const locked = i > currentStageIndex;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                  current
                    ? 'bg-gold-500 border-gold-300 text-ink-950 shadow-pixel animate-pop-in'
                    : done
                    ? 'bg-gold-700/70 border-gold-600 text-parchment-100'
                    : 'bg-ink-700 border-ink-600 text-parchment-300/40'
                }`}
              >
                {locked ? '🔒' : done ? '✓' : i + 1}
              </div>
              {i < totalStages - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-1 rounded ${
                    i < currentStageIndex ? 'bg-gold-600' : 'bg-ink-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pl-3 border-l border-ink-600">
        <span className="font-pixel text-[8px] text-parchment-300/60 tracking-wider whitespace-nowrap">
          REWARD
        </span>
        <span className="text-xl" aria-hidden>
          📦
        </span>
        <span className="text-xs font-mono text-gold-300">
          <span aria-hidden>⭐</span> x{rewardStars}
        </span>
      </div>
    </div>
  );
}
