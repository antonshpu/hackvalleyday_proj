import { useState } from 'react';
import type { Level, ProjectPlan } from '../types';
import type { ProfileApi } from '../hooks/useProfile';
import { CharacterSprite } from './CharacterSprite';
import { Scene } from './Scene';
import { PlatformProgressBar } from './PlatformProgressBar';
import { StatusFooter } from './StatusFooter';
import { StageBriefing } from './StageBriefing';

interface Props {
  plan: ProjectPlan;
  level: Level;
  profile: ProfileApi;
  onStart: () => void;
  onExitToHome: () => void;
  onResetProgress: () => void;
}

export function StageScreen({ plan, level, profile, onStart, onExitToHome, onResetProgress }: Props) {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="h-full flex flex-col bg-ink-900">
      <PlatformProgressBar
        totalStages={plan.levels.length}
        currentStageIndex={level.index}
        rewardStars={Math.max(1, Math.round(level.xpReward / 100))}
      />

      <div className="flex-1 min-h-0 grid grid-cols-[280px_1fr] gap-4 p-4">
        <StageBriefing level={level} onStart={onStart} />

        <div className="min-w-0 flex flex-col gap-3">
          <div className="relative">
            <Scene height={260}>
              <div className="absolute left-10 bottom-[13%] flex items-end gap-3">
                <CharacterSprite state="IDLE" size={80} />
                <div className="bg-ink-900/80 border border-ink-700 rounded px-2 py-1 text-[10px] font-mono text-parchment-100 -mb-1">
                  {level.index + 1}-1
                </div>
              </div>
              <div className="absolute right-10 bottom-[13%] flex items-end gap-3 text-3xl" aria-hidden>
                <span>🍞</span>
                <span>📦</span>
                <span>🍯</span>
              </div>
            </Scene>

            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => setShowHints((s) => !s)}
                className="w-9 h-9 rounded-md bg-ink-900/80 border border-ink-600 flex items-center justify-center hover:bg-ink-800 retro-focus"
                title="Hints"
              >
                📖
              </button>
              <button
                className="w-9 h-9 rounded-md bg-ink-900/80 border border-ink-600 flex items-center justify-center hover:bg-ink-800 retro-focus"
                title="Settings"
              >
                ⚙️
              </button>
            </div>

            {showHints && (
              <div className="absolute top-14 right-3 w-64 bg-ink-800 border-2 border-ink-600 rounded-md p-3 shadow-pixel animate-pop-in z-10">
                <p className="font-pixel text-[9px] text-arcane-300 tracking-wider mb-2">HINTS</p>
                <p className="text-xs text-parchment-200 leading-relaxed">
                  {level.tasks[0]?.solutionHint[0] ?? 'Read the objective, then write the smallest piece of code that satisfies it.'}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-2 gap-3">
            <div className="rounded-md border-2 border-ink-600 bg-[#1e1e1e] flex flex-col overflow-hidden">
              <div className="h-8 shrink-0 flex items-center px-3 bg-ink-800 border-b border-ink-600">
                <span className="text-xs font-mono text-parchment-300/70">{level.fileName}</span>
              </div>
              <pre className="flex-1 p-3 text-xs font-mono text-parchment-300/40 overflow-auto whitespace-pre-wrap">
                <span className="text-gold-500/60">1</span>{'   '}
                <span className="animate-blink">|</span>
              </pre>
            </div>
            <div className="rounded-md border-2 border-ink-600 bg-ink-900 flex flex-col overflow-hidden">
              <div className="h-8 shrink-0 flex items-center px-3 bg-ink-800 border-b border-ink-600">
                <span className="text-[10px] font-pixel text-parchment-300/70">OUTPUT</span>
              </div>
              <div className="flex-1 flex items-center justify-center text-xs text-parchment-300/30 font-mono">
                …
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatusFooter
        name={profile.name}
        level={profile.level}
        xpIntoLevel={profile.xpIntoLevel}
        xpForNextLevel={profile.xpForNextLevel}
        projects={profile.projectsCompleted}
        streak={profile.streak}
        onExitToHome={onExitToHome}
        onResetProgress={onResetProgress}
      />
    </div>
  );
}
