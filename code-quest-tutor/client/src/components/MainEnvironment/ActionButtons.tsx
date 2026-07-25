import { BookOpen, CheckCircle, Lightbulb, Loader2 } from 'lucide-react';

interface Props {
  onHint: () => void;
  onCheck: () => void;
  onResources: () => void;
  checking: boolean;
  hinting: boolean;
}

export default function ActionButtons({ onHint, onCheck, onResources, checking, hinting }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2">
      <button
        onClick={onCheck}
        disabled={checking}
        className="pixel-font text-[10px] flex items-center justify-center gap-2 bg-xp text-void py-3 rounded-sm shadow-glowXp hover:brightness-110 active:translate-y-0.5 transition disabled:opacity-50"
      >
        {checking ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
        {checking ? 'CHECKING…' : 'CHECK CODE'}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onHint}
          disabled={hinting}
          className="flex items-center justify-center gap-1.5 font-mono text-xs bg-panelLight border border-border text-gold py-2.5 rounded-sm hover:border-gold transition disabled:opacity-50"
        >
          {hinting ? <Loader2 size={13} className="animate-spin" /> : <Lightbulb size={13} />}
          Hint
        </button>
        <button
          onClick={onResources}
          className="flex items-center justify-center gap-1.5 font-mono text-xs bg-panelLight border border-border text-ink py-2.5 rounded-sm hover:border-dim transition"
        >
          <BookOpen size={13} />
          Resources
        </button>
      </div>
    </div>
  );
}
