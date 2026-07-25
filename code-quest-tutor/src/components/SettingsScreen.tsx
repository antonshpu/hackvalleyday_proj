interface Props {
  onBack: () => void;
  onResetProfile: () => void;
}

export function SettingsScreen({ onBack, onResetProfile }: Props) {
  return (
    <div className="h-full w-full flex flex-col bg-ink-900">
      <header className="shrink-0 h-16 flex items-center justify-between px-6 border-b-2 border-ink-600 bg-ink-800/60">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-2xl">🍞</span>
          <span className="font-pixel text-gold-400 text-sm tracking-wide">TOAST CODE</span>
        </div>
        <button
          onClick={onBack}
          className="font-pixel text-[10px] text-parchment-300/70 hover:text-gold-300"
        >
          ← BACK TO HOME
        </button>
      </header>
      <div className="flex-1 p-6">
        <span className="font-pixel text-[9px] text-gold-400 tracking-wider">⚙️ SETTINGS</span>
        <div className="mt-4 bg-ink-800 border-2 border-ink-600 rounded-md p-4 max-w-md">
          <p className="text-sm text-parchment-100">Reset all progress</p>
          <p className="text-xs text-parchment-300/60 mt-1">
            Clears your XP, streak, and project history. This can't be undone.
          </p>
          <button
            onClick={onResetProfile}
            className="mt-3 bg-ember-500 hover:bg-ember-400 text-ink-950 font-pixel text-[10px] px-4 py-2.5 rounded-md shadow-pixel"
          >
            RESET PROGRESS
          </button>
        </div>
      </div>
    </div>
  );
}
