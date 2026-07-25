import { CharacterSprite } from './CharacterSprite';

interface Props {
  levelTitle: string;
  xpEarned: number;
  onContinue: () => void;
  isFinalLevel: boolean;
}

export function LevelCompleteOverlay({ levelTitle, xpEarned, onContinue, isFinalLevel }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-ink-950/90 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 text-center px-6">
        <CharacterSprite state="CELEBRATING" size={220} />
        <p className="font-pixel text-gold-400 text-xs tracking-widest mt-2">
          {isFinalLevel ? 'QUEST COMPLETE' : 'LEVEL COMPLETE'}
        </p>
        <h2 className="text-parchment-100 text-xl font-semibold">{levelTitle}</h2>
        <p className="font-mono text-arcane-300 text-sm">+{xpEarned} XP</p>
        <button
          onClick={onContinue}
          className="mt-4 bg-gold-500 hover:bg-gold-400 text-ink-950 font-pixel text-[10px] px-6 py-3 rounded-md shadow-pixel retro-focus"
        >
          {isFinalLevel ? '🏆 FINISH' : 'CONTINUE →'}
        </button>
      </div>
    </div>
  );
}
