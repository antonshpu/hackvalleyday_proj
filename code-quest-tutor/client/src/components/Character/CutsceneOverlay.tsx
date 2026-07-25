import { useEffect, useState } from 'react';

interface Props {
  levelTitle: string;
  xpGained: number;
  onDone: () => void;
}

export default function CutsceneOverlay({ levelTitle, xpGained, onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-label={`Level complete: ${levelTitle}`}
    >
      <div className="text-center">
        <div className="mx-auto mb-6 h-16 w-16 relative">
          <div className="absolute inset-0 flex items-center justify-center text-4xl animate-flip">🧑‍🚀</div>
        </div>
        <p className="pixel-font text-gold text-lg mb-3 animate-pulse">LEVEL COMPLETE!</p>
        <p className="text-ink font-mono text-sm mb-1">{levelTitle}</p>
        <p className="text-xp font-mono text-sm">+{xpGained} XP</p>
      </div>
    </div>
  );
}
