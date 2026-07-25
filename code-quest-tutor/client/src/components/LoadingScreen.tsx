import { useEffect, useState } from 'react';

const MESSAGES = [
  'Scouting the terrain…',
  'Sketching the platforms…',
  'Writing the first TASK markers…',
  'Warming up the hero…',
];

export default function LoadingScreen({ projectName }: { projectName: string }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bob">🧑‍💻</div>
        <div className="absolute -top-2 -right-2 text-gold text-lg animate-pulse">?</div>
      </div>
      <p className="pixel-font text-[11px] text-ink text-center leading-relaxed">
        Building "{projectName}"…
      </p>
      <p className="font-mono text-sm text-dim" aria-live="polite">
        {MESSAGES[msgIndex]}
      </p>
      <div className="w-56 h-2 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-gold animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
}
