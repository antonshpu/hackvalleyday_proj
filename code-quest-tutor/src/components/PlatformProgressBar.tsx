interface Props {
  totalStages: number;
  currentStageIndex: number;
  rewardStars?: number;
}

export function PlatformProgressBar({ totalStages, currentStageIndex, rewardStars = 3 }: Props) {
  return (
    <div className="px-4 py-3">
      <div className="bread-loaf flex flex-col gap-3 px-4 py-4 !bg-[#f3dfb0]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-pixel tracking-[0.45em] text-[#5c3a22] uppercase">
              Platform Progress
            </span>
            <div className="bread-crust-chip px-3 py-1 text-[10px]">
              Stage {currentStageIndex + 1} / {totalStages}
            </div>
          </div>

          <div className="bread-crumb flex items-center gap-2 px-3 py-2 text-[10px] text-[#5c3a22]">
            <span className="text-base">🍞</span>
            <span className="font-pixel uppercase tracking-[0.3em] text-[#5c3a22]">Reward</span>
            <span className="font-mono text-[12px] font-semibold text-[#3b2415]">x{rewardStars}</span>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#c47a3a]/45" />
          {Array.from({ length: totalStages }).map((_, i) => {
            const done = i < currentStageIndex;
            const current = i === currentStageIndex;
            return (
              <div key={i} className="relative flex items-center justify-center flex-1 last:flex-none">
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-[3px] text-xs font-mono shrink-0 transition-colors ${
                    current
                      ? 'bg-[#f0d264] border-[#8b4e24] text-[#3b2415] shadow-[2px_2px_0_#5c3a22]'
                      : done
                        ? 'bg-[#c47a3a] border-[#8b4e24] text-[#f8edd4]'
                        : 'bg-[#f8edd4] border-[#a66a3a] text-[#7a5230]'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
