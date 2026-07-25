import { useEffect, useRef, useState } from 'react';
import type { CharacterState, Task } from '../../types';

interface Props {
  tasks: Task[];
  characterState: CharacterState;
  levelTitle: string;
}

/** A tiny 8-bit style hero drawn entirely in CSS boxes — no image assets required. */
function Sprite({ state }: { state: CharacterState }) {
  const bodyColor = state === 'FAILING' ? 'bg-danger' : 'bg-xp';
  const animClass =
    state === 'JUMPING'
      ? 'animate-jump'
      : state === 'FALLING'
      ? 'animate-fall'
      : state === 'CELEBRATING'
      ? 'animate-flip'
      : state === 'WALKING'
      ? 'animate-bob'
      : '';

  return (
    <div className={`relative w-8 h-8 ${animClass}`} style={{ imageRendering: 'pixelated' }}>
      {/* head */}
      <div className={`absolute left-1 top-0 w-6 h-3 ${bodyColor}`} />
      {/* eyes */}
      <div className="absolute left-2 top-1 w-1 h-1 bg-void" />
      <div className="absolute left-4 top-1 w-1 h-1 bg-void" />
      {/* body */}
      <div className={`absolute left-0 top-3 w-8 h-3 ${bodyColor} opacity-90`} />
      {/* legs */}
      <div className={`absolute left-1 top-6 w-2 h-2 ${bodyColor} opacity-80`} />
      <div className={`absolute left-5 top-6 w-2 h-2 ${bodyColor} opacity-80`} />
      {state === 'CELEBRATING' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-gold text-xs pixel-font">★</div>
      )}
    </div>
  );
}

export default function PlatformerCharacter({ tasks, characterState, levelTitle }: Props) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const total = Math.max(tasks.length, 1);
  const progressIndex = Math.min(completedCount, total - 1 >= 0 ? total : total);
  const [bump, setBump] = useState(false);
  const prevCompleted = useRef(completedCount);

  useEffect(() => {
    if (completedCount !== prevCompleted.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 650);
      prevCompleted.current = completedCount;
      return () => clearTimeout(t);
    }
  }, [completedCount]);

  const heroLeftPercent = total <= 1 ? 50 : (progressIndex / total) * 92 + 4;

  return (
    <div className="pixel-panel crt-scanlines bg-panel p-3 rounded-sm">
      <p className="pixel-font text-[9px] text-gold mb-3 truncate" title={levelTitle}>
        {levelTitle}
      </p>

      <div className="relative h-24 bg-void rounded-sm overflow-hidden border border-border">
        {/* sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12161f] to-[#0a0e14]" />

        {/* platforms — one per task */}
        <div className="absolute bottom-3 left-0 right-0 flex items-end justify-between px-3">
          {tasks.map((task, i) => (
            <div key={task.id} className="flex flex-col items-center gap-1" style={{ width: `${100 / total}%` }}>
              {characterState === 'FAILING' && i === progressIndex && (
                <span className="text-danger text-[10px] animate-blink">✕</span>
              )}
              <div
                className={`h-2 w-full rounded-sm border ${
                  task.completed ? 'bg-xp/70 border-xp shadow-glowXp' : 'bg-border border-dim'
                }`}
                title={task.description}
              />
            </div>
          ))}
        </div>

        {/* hero */}
        <div
          className={`absolute bottom-6 transition-all duration-500 ease-out ${bump ? '' : ''}`}
          style={{ left: `${heroLeftPercent}%`, transform: 'translateX(-50%)' }}
        >
          <Sprite state={characterState} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-dim font-mono">
        <span>
          {completedCount}/{tasks.length} tasks
        </span>
        <div className="flex-1 mx-2 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-xp transition-all duration-500"
            style={{ width: `${(completedCount / Math.max(tasks.length, 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
