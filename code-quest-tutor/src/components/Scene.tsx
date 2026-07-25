import type { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  className?: string;
  height?: number | string;
  showWindmill?: boolean;
  showVillage?: boolean;
}

export function Scene({
  children,
  className = '',
  height = 260,
  showWindmill = true,
  showVillage = true,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 border-ink-600 shadow-pixel ${className}`}
      style={{
        height,
        background: 'linear-gradient(180deg, #5FB6E0 0%, #8FD2EC 45%, #C9ECDA 78%, #C9ECDA 100%)',
      }}
    >
      {/* clouds */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute bg-white/85 rounded-full animate-drift"
            style={{
              width: 46 + i * 12,
              height: 16 + i * 3,
              left: `${6 + i * 24}%`,
              top: `${6 + i * 8}%`,
              animationDelay: `${i * 1.1}s`,
              filter: 'blur(0.3px)',
            }}
          />
        ))}
      </div>

      {/* windmill */}
      {showWindmill && (
        <div className="absolute right-[8%] top-[6%] pointer-events-none">
          <div className="relative w-4 h-24 mx-auto rounded-sm bg-parchment-200/60 border border-ink-700/40" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 animate-windmill">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'repeating-conic-gradient(#EDE6D6 0deg 12deg, transparent 12deg 90deg)',
                opacity: 0.85,
              }}
            />
          </div>
        </div>
      )}

      {/* distant village silhouette */}
      {showVillage && (
        <div className="absolute bottom-[26%] inset-x-0 h-16 opacity-60 flex items-end justify-around px-6 pointer-events-none">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-gold-700/60 rounded-t-sm"
              style={{ width: 12 + ((i * 5) % 14), height: 18 + ((i * 9) % 30) }}
            />
          ))}
        </div>
      )}

      {/* tree line */}
      <div className="absolute bottom-[16%] inset-x-0 h-10 bg-green-900/40 pointer-events-none" />

      {/* ground / platform */}
      <div className="absolute bottom-0 inset-x-0 h-[16%] bg-gradient-to-b from-green-700 to-green-800 border-t-4 border-green-950/60" />
      <div className="absolute bottom-0 inset-x-0 h-[6%] bg-ink-900" />

      {/* foreground content layer (character, signs, props) */}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
