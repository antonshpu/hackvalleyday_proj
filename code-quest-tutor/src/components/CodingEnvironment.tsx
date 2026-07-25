import { useEffect, useState } from 'react';
import type { ProjectPlan, Task } from '../types';
import { useGameState } from '../hooks/useGameState';
import type { ProfileApi } from '../hooks/useProfile';
import { mockGenerateHint, mockValidateCode } from '../data/mockGemini';
import { PlatformProgressBar } from './PlatformProgressBar';
import { StatusFooter } from './StatusFooter';
import { FileExplorer } from './FileExplorer';
import { EditorPanel } from './EditorPanel';
import { PlatformerTrack } from './PlatformerTrack';
import { TaskChecklist } from './TaskChecklist';
import { ActionButtons } from './ActionButtons';
import { OutputPreview } from './OutputPreview';
import { TerminalPanel } from './TerminalPanel';
import { LevelCompleteOverlay } from './LevelCompleteOverlay';

interface Props {
  plan: ProjectPlan;
  profile: ProfileApi;
  onLevelContinue: (isLastLevel: boolean) => void;
  onExitToHome: () => void;
}

export function CodingEnvironment({ plan, profile, onLevelContinue, onExitToHome }: Props) {
  const { state, setCharacterState, awardXpAndAdvance, resetProgress } = useGameState(plan);
  const level = plan.levels[state.currentLevelIndex] ?? plan.levels[plan.levels.length - 1];
  const currentTask = level.tasks[state.currentTaskIndex];

  const [code, setCode] = useState(level.boilerplate);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ message: string; lines: number[] } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isHinting, setIsHinting] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  // reset editor content whenever we move to a new level
  useEffect(() => {
    setCode(level.boilerplate);
    setFeedback(null);
    setHintText(null);
    setHintLevel(0);
  }, [level.id]);

  const isLastTaskInLevel = state.currentTaskIndex === level.tasks.length - 1;
  const isLastLevel = state.currentLevelIndex === plan.levels.length - 1;

  async function handleCheck() {
    if (!currentTask) return;
    setIsChecking(true);
    setFeedback(null);
    setValidationErrors(null);
    const result = await mockValidateCode(code, currentTask);
    setIsChecking(false);
    setFeedback(result.feedback);

    if (!result.correct) {
      setValidationErrors({
        message: result.errorMessage ?? result.feedback,
        lines: result.errorLines ?? [1],
      });
    } else {
      setValidationErrors(null);
    }

    if (result.correct) {
      currentTask.completed = true;
      setCharacterState('WALKING');
      setTimeout(() => {
        if (isLastTaskInLevel) {
          level.completed = true;
          setCharacterState('JUMPING');
          profile.addXp(level.xpReward);
          if (isLastLevel) profile.completeProject();
          awardXpAndAdvance(level.xpReward, true, isLastLevel);
          setTimeout(() => setShowLevelComplete(true), 900);
        } else {
          setCharacterState('IDLE');
          profile.addXp(25);
          awardXpAndAdvance(25, false, isLastLevel);
        }
      }, 650);
    } else {
      setCharacterState('FAILING');
      setTimeout(() => setCharacterState('IDLE'), 700);
    }
  }

  async function handleHint() {
    if (!currentTask) return;
    setIsHinting(true);
    setCharacterState('CASTING');
    const result = await mockGenerateHint(currentTask, hintLevel);
    setIsHinting(false);
    setHintText(result.hint);
    setHintLevel((h) => Math.min(h + 1, currentTask.solutionHint.length - 1));
    setCharacterState('IDLE');
  }

  function handleResources() {
    window.open(
      'https://developer.mozilla.org/en-US/search?q=' + encodeURIComponent(currentTask?.title ?? ''),
      '_blank',
      'noopener'
    );
  }

  function handleContinue() {
    setShowLevelComplete(false);
    onLevelContinue(isLastLevel);
  }

  return (
    <div className="h-full flex flex-col bg-ink-950">
      <PlatformProgressBar
        totalStages={plan.levels.length}
        currentStageIndex={state.currentLevelIndex}
        rewardStars={Math.max(1, Math.round(level.xpReward / 100))}
      />

      <div className="flex-1 min-h-0 overflow-hidden px-4 py-4">
        <div className="grid h-full min-h-0 grid-cols-[24%_1.1fr_26%] gap-4">
          <div className="flex flex-col gap-4 min-h-0">
            <div className="rounded-[32px] border-2 border-ink-700 bg-ink-900 p-4 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
              <div className="inline-flex items-center gap-2 rounded-full bg-ink-800 px-3 py-1 text-[10px] font-pixel uppercase tracking-[0.35em] text-gold-300">
                Stage {state.currentLevelIndex + 1}
              </div>

              <div className="mt-4 space-y-3">
                <h2 className="text-xl font-bold uppercase tracking-[0.1em] text-parchment-100">
                  {level.title}
                </h2>
                <p className="text-sm leading-relaxed text-parchment-300/80">
                  {currentTask?.description ?? 'Complete the task to advance the platformer.'}
                </p>
              </div>

              <div className="mt-5 rounded-[24px] border border-ink-700 bg-ink-800 p-4">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.35em] text-parchment-300/70">
                  <span>Reward</span>
                  <span className="font-mono text-gold-300">x{Math.max(1, Math.round(level.xpReward / 100))}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-ink-900 border border-ink-700 flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-parchment-100">Stage reward</p>
                    <p className="text-[11px] text-parchment-300">Finish the current challenge to progress.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-[32px] border-2 border-ink-700 bg-ink-900 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
              <FileExplorer levels={plan.levels} currentLevelIndex={state.currentLevelIndex} />
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-0">
            <div className="rounded-[32px] border-2 border-ink-700 bg-ink-900 p-4 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
              <PlatformerTrack
                tasks={level.tasks}
                currentTaskIndex={state.currentTaskIndex}
                characterState={state.characterState}
              />
            </div>

            <div className="flex flex-col gap-4 min-h-0">
              <div className="h-[520px] min-h-[520px] overflow-hidden rounded-[32px] border-2 border-ink-700 bg-ink-900 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
                <EditorPanel
                  level={level}
                  code={code}
                  onChange={setCode}
                  validationErrors={validationErrors}
                  currentTask={currentTask}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 min-h-0">
                <div className="h-64 overflow-hidden rounded-[32px] border-2 border-ink-700 bg-ink-900 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
                  <OutputPreview code={code} language={level.language} />
                </div>
                <div className="h-64 overflow-hidden rounded-[32px] border-2 border-ink-700 bg-ink-900 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
                  <TerminalPanel />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-0">
            <div className="rounded-[32px] border-2 border-ink-700 bg-ink-900 p-4 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
              <span className="text-[9px] uppercase tracking-[0.35em] text-parchment-300/70">
                Current Objective
              </span>
              <h3 className="mt-3 text-lg font-semibold text-parchment-100">{currentTask?.title}</h3>
              <p className="mt-2 text-sm text-parchment-300 leading-relaxed">{currentTask?.description}</p>
            </div>

            <div className="rounded-[32px] border-2 border-ink-700 bg-ink-900 p-4 shadow-[0_10px_0_rgba(0,0,0,0.18)]">
              <TaskChecklist tasks={level.tasks} currentTaskIndex={state.currentTaskIndex} />
            </div>

            {feedback && (
              <div
                className={`rounded-[24px] border px-4 py-3 text-sm ${
                  feedback.startsWith('Nice')
                    ? 'border-gold-600 bg-gold-500/10 text-gold-300'
                    : 'border-ember-500 bg-ember-500/10 text-ember-400'
                }`}
              >
                {feedback}
              </div>
            )}

            {hintText && (
              <div className="rounded-[24px] border border-arcane-500 bg-arcane-400/10 px-4 py-3 text-sm text-arcane-300">
                <div className="text-[9px] uppercase tracking-[0.35em] text-parchment-300/70">Hint</div>
                <p className="mt-2">{hintText}</p>
              </div>
            )}

            <div className="mt-auto">
              <ActionButtons
                onHint={handleHint}
                onCheck={handleCheck}
                onResources={handleResources}
                isChecking={isChecking}
                isHinting={isHinting}
              />
            </div>
          </div>
        </div>
      </div>

      <StatusFooter
        name={profile.name}
        level={profile.level}
        onExitToHome={onExitToHome}
        onResetProgress={resetProgress}
      />

      {showLevelComplete && (
        <LevelCompleteOverlay
          levelTitle={level.title}
          xpEarned={level.xpReward}
          onContinue={handleContinue}
          isFinalLevel={isLastLevel}
        />
      )}
    </div>
  );
}
