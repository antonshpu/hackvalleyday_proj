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
        className="w-full bg-[#f0d264] hover:brightness-105 disabled:opacity-60 text-[#3b2415] font-pixel text-[10px] py-3 rounded-md border-[3px] border-[#8b4e24] shadow-[3px_3px_0_#5c3a22] transition-colors retro-focus"
      >
        {isChecking ? 'CHECKING…' : '✅ CHECK CODE'}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onHint}
          disabled={isHinting}
          className="bg-[#f8edd4] hover:bg-[#f0d9a8] disabled:opacity-60 text-[#5c3a22] font-pixel text-[9px] py-2.5 rounded-md border-[3px] border-[#8b4e24] transition-colors retro-focus"
        >
          {isHinting ? '…' : '💡 HINT'}
        </button>
        <button
          onClick={onResources}
          className="bg-[#f8edd4] hover:bg-[#f0d9a8] text-[#5c3a22] font-pixel text-[9px] py-2.5 rounded-md border-[3px] border-[#8b4e24] transition-colors retro-focus"
        >
          📖 DOCS
        </button>
      </div>
    </div>
  );
}
