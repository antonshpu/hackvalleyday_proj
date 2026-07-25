interface Props {
  totalStages: number;
  currentStageIndex: number;
  rewardStars?: number;
}

export function PlatformProgressBar({ totalStages, currentStageIndex, rewardStars = 3 }: Props) {
  return (
    <div className="px-4 py-3">
      <div className="flex flex-col gap-3 rounded-[32px] border-2 border-ink-700 bg-ink-900 px-4 py-4 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-pixel tracking-[0.45em] text-gold-300 uppercase">
              Platform Progress
            </span>
            <div className="rounded-full border border-ink-700 bg-ink-800 px-3 py-1 text-[10px] text-parchment-300">
              Stage {currentStageIndex + 1} / {totalStages}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-[10px] text-parchment-300">
            <span className="text-base">📦</span>
            <span className="font-pixel uppercase tracking-[0.3em] text-gold-300">Reward</span>
            <span className="font-mono text-[12px] text-gold-300">x{rewardStars}</span>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-ink-700" />
          {Array.from({ length: totalStages }).map((_, i) => {
            const done = i < currentStageIndex;
            const current = i === currentStageIndex;
            return (
              <div key={i} className="relative flex items-center justify-center flex-1 last:flex-none">
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-mono shrink-0 transition-colors ${
                    current
                      ? 'bg-gold-500 border-gold-300 text-ink-950 shadow-pixel'
                      : done
                      ? 'bg-gold-700/80 border-gold-600 text-parchment-100'
                      : 'bg-ink-700 border-ink-600 text-parchment-300/50'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </div>
                {i < totalStages - 1 && (
                  <div className="absolute right-0 top-1/2 h-10 w-0.5 -translate-y-1/2 rounded-full bg-ink-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
