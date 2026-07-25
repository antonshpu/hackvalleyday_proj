import { useEffect, useRef, useState } from 'react';
import { useChromaKeyedSrcs } from '../hooks/useChromaKeyedSrc';

const FRAME_SRCS = [
  '/sprites/idle.png',
  '/sprites/cast-1.png',
  '/sprites/cast-2.png',
  '/sprites/cast-3.png',
  '/sprites/wand-magic.png',
];

/** One full pass through all 3 cast frames. */
const CYCLE_MS = 1000;
const FRAME_MS = CYCLE_MS / 3;
/** Celebrate a few times so it reads clearly without overstaying. */
const LOOP_COUNT = 3;

interface Props {
  celebrating: boolean;
  dimmed?: boolean;
  onCelebrateDone?: () => void;
}

export function SuccessCastOverlay({ celebrating, dimmed = false, onCelebrateDone }: Props) {
  const keyed = useChromaKeyedSrcs(FRAME_SRCS);
  const [castFrame, setCastFrame] = useState(0);
  const onDoneRef = useRef(onCelebrateDone);
  onDoneRef.current = onCelebrateDone;

  const idle = keyed[0];
  const castFrames = keyed.slice(1, 4);
  const wandMagic = keyed[4];
  const ready = Boolean(idle) && castFrames.every(Boolean);

  useEffect(() => {
    if (!celebrating || !ready) return;

    setCastFrame(0);

    const started = performance.now();
    const totalMs = CYCLE_MS * LOOP_COUNT;
    let raf = 0;
    let finished = false;

    const tick = (now: number) => {
      const elapsed = now - started;
      if (elapsed >= totalMs) {
        if (!finished) {
          finished = true;
          setCastFrame(0);
          onDoneRef.current?.();
        }
        return;
      }
      const cyclePos = elapsed % CYCLE_MS;
      setCastFrame(Math.min(2, Math.floor(cyclePos / FRAME_MS)));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [celebrating, ready]);

  if (!ready) return null;

  const src = celebrating ? castFrames[castFrame]! : idle!;
  const showMagic = celebrating && castFrame >= 1 && wandMagic;

  return (
    <div
      className={`pointer-events-none fixed inset-0 flex items-start justify-start pt-[15%] pl-[35%] ${
        dimmed ? 'z-40 opacity-40' : 'z-[45]'
      }`}
      aria-hidden
    >
      <div
        className={`relative ${
          celebrating
            ? 'h-24 w-24 sm:h-28 sm:w-28 -translate-y-3'
            : 'h-16 w-16 sm:h-20 sm:w-20'
        }`}
      >
        <img
          src={src}
          alt=""
          className={`pixelated absolute inset-0 h-full w-full object-contain ${
            celebrating
              ? 'drop-shadow-[0_0_18px_rgba(255,210,90,0.55)]'
              : 'drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sprite-bob'
          }`}
          draggable={false}
        />
        {showMagic && (
          <img
            src={wandMagic}
            alt=""
            className="pixelated absolute top-[38%] left-[58%] h-[42%] w-auto max-w-[130%] origin-left object-contain opacity-95"
            style={{ imageRendering: 'pixelated' }}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}
