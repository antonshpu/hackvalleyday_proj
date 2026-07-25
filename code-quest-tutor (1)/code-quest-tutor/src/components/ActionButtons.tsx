interface Props {
  onHint: () => void;
  onCheck: () => void;
  onResources: () => void;
  isChecking: boolean;
  isHinting: boolean;
}

export function ActionButtons({ onHint, onCheck, onResources, isChecking, isHinting }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2">
      <button
        onClick={onCheck}
        disabled={isChecking}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-ink-950 font-pixel text-[10px] py-3 rounded-md shadow-pixel transition-colors retro-focus"
      >
        {isChecking ? 'CHECKING…' : '✅ CHECK CODE'}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onHint}
          disabled={isHinting}
          className="bg-ink-700 hover:bg-ink-600 disabled:opacity-60 text-arcane-300 font-pixel text-[9px] py-2.5 rounded-md border border-ink-600 transition-colors retro-focus"
        >
          {isHinting ? '…' : '💡 HINT'}
        </button>
        <button
          onClick={onResources}
          className="bg-ink-700 hover:bg-ink-600 text-parchment-300 font-pixel text-[9px] py-2.5 rounded-md border border-ink-600 transition-colors retro-focus"
        >
          📖 DOCS
        </button>
      </div>
    </div>
  );
}
