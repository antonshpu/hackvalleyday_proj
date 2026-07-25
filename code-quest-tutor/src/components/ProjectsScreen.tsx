import type { ProjectPlan } from '../types';

interface Props {
  plan: ProjectPlan | null;
  onBack: () => void;
}

export function ProjectsScreen({ plan, onBack }: Props) {
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
      <div className="flex-1 p-6 overflow-y-auto">
        <span className="font-pixel text-[9px] text-gold-400 tracking-wider">📁 PROJECTS</span>
        {plan ? (
          <div className="mt-4 bg-ink-800 border-2 border-ink-600 rounded-md p-4 max-w-xl">
            <p className="text-parchment-100 font-medium">{plan.projectName}</p>
            <p className="text-xs text-parchment-300/60 mt-1">{plan.description}</p>
            <ul className="mt-3 space-y-1.5">
              {plan.levels.map((lvl) => (
                <li key={lvl.id} className="flex items-center gap-2 text-xs text-parchment-200">
                  <span aria-hidden>{lvl.completed ? '✅' : '⬜'}</span>
                  Stage {lvl.index + 1}: {lvl.title}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-sm text-parchment-300/50">
            No quests started yet. Head back home and describe something you'd like to build!
          </p>
        )}
      </div>
    </div>
  );
}
