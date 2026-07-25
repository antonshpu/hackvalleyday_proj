import { useEffect, useState } from 'react';
import type { ProjectPlan } from '../types';
import { useGameState } from '../hooks/useGameState';
import type { ProfileApi } from '../hooks/useProfile';
import { mockGenerateHint, mockValidateCode } from '../data/mockGemini';
import { PlatformProgressBar } from './PlatformProgressBar';
import { PlatformerTrack } from './PlatformerTrack';
import { StatusFooter } from './StatusFooter';
import { FileExplorer } from './FileExplorer';
import { EditorPanel } from './EditorPanel';
import { TaskChecklist } from './TaskChecklist';
import { ActionButtons } from './ActionButtons';
import { LevelCompleteOverlay } from './LevelCompleteOverlay';
import { SuccessCastOverlay } from './SuccessCastOverlay';

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
  const [showSuccessCast, setShowSuccessCast] = useState(false);

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
    setCharacterState('CASTING');

    const result = await mockValidateCode(code, currentTask);
    setIsChecking(false);

    if (result.correct) {
      setShowSuccessCast(true);
      setCharacterState('WALKING');
      setFeedback(result.feedback);
      setTimeout(() => {
        setCharacterState('PUSHING');
        setTimeout(() => {
          setCharacterState('JUMPING');
          setTimeout(() => {
            const finishedLevel = isLastTaskInLevel;
            awardXpAndAdvance(level.xpReward, isLastTaskInLevel, isLastLevel);
            if (finishedLevel) {
              setShowLevelComplete(true);
              setCharacterState('CELEBRATING');
            } else {
              setCharacterState('IDLE');
            }
          }, 650);
        }, 400);
      }, 400);
    } else {
      setCharacterState('FAILING');
      setTimeout(() => setCharacterState('IDLE'), 700);
      setFeedback(result.feedback);
      if (result.errors?.length) {
        setValidationErrors({
          message: result.errors[0].message,
          lines: result.errors.map((e) => e.line),
        });
      }
    }
  }

  async function handleHint() {
    if (!currentTask) return;
    setIsHinting(true);
    setCharacterState('CASTING');
    const next = Math.min(hintLevel + 1, 3);
    const result = await mockGenerateHint(currentTask, next);
    setHintLevel(result.hintLevel);
    setHintText(result.hint);
    setIsHinting(false);
    setCharacterState('IDLE');
  }

  function handleResources() {
    window.open('https://developer.mozilla.org/', '_blank', 'noopener,noreferrer');
  }

  function handleContinue() {
    setShowLevelComplete(false);
    onLevelContinue(isLastLevel);
  }

  return (
    <div
      className="h-full flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/coding-bg.png')" }}
    >
      <PlatformProgressBar
        totalStages={plan.levels.length}
        currentStageIndex={state.currentLevelIndex}
        rewardStars={Math.max(1, Math.round(level.xpReward / 100))}
      />

      <div className="px-4 py-4">
        <PlatformerTrack
          tasks={level.tasks}
          currentTaskIndex={state.currentTaskIndex}
          characterState={state.characterState}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden px-4 py-4">
        <div className="grid h-full min-h-0 grid-cols-[24%_1.1fr_26%] gap-4">
          <div className="flex flex-col gap-4 min-h-0">
            <div className="bread-loaf p-4">
              <div className="bread-crust-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-pixel uppercase tracking-[0.35em]">
                Stage {state.currentLevelIndex + 1}
              </div>

              <div className="mt-4 space-y-3">
                <h2 className="text-xl font-bold uppercase tracking-[0.1em] bread-strong">
                  {level.title}
                </h2>
                <p className="text-sm leading-relaxed bread-muted">
                  {currentTask?.description ?? 'Complete the task to advance the platformer.'}
                </p>
              </div>

              <div className="bread-crumb mt-5 p-4">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.35em] bread-muted">
                  <span>Reward</span>
                  <span className="font-mono bread-title font-semibold">
                    x{Math.max(1, Math.round(level.xpReward / 100))}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border-3 border-[#8b4e24] bg-[#f8edd4] flex items-center justify-center text-2xl shadow-[2px_2px_0_#5c3a22]">
                    🍞
                  </div>
                  <div>
                    <p className="text-sm font-semibold bread-strong">Stage reward</p>
                    <p className="text-[11px] bread-muted">Finish the current challenge to progress.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bread-loaf flex-1 overflow-hidden">
              <FileExplorer levels={plan.levels} currentLevelIndex={state.currentLevelIndex} />
            </div>
          </div>

          <div className="flex flex-col min-h-0 h-full justify-center">
            <div className="flex flex-col items-center w-full -mt-10">
              <img
                src="/coding-platform.png"
                alt=""
                aria-hidden
                className="relative z-10 w-full max-w-full h-auto object-contain select-none pointer-events-none drop-shadow-[2px_3px_0_rgba(0,0,0,0.2)]"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="relative z-0 bread-loaf w-full h-[340px] min-h-[280px] shrink-0 overflow-hidden p-2 -mt-28">
                <div className="h-full overflow-hidden rounded-[14px] border-[3px] border-[#5c3a22] bg-[#12100C]">
                  <EditorPanel
                    level={level}
                    code={code}
                    onChange={setCode}
                    validationErrors={validationErrors}
                    currentTask={currentTask}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-0 h-full">
            <div className="mt-auto flex flex-col gap-4 min-h-0">
              <div className="bread-loaf p-4 shrink-0">
                <span className="text-[9px] uppercase tracking-[0.35em] bread-muted font-pixel">
                  Current Objective
                </span>
                <h3 className="mt-3 text-lg font-semibold bread-strong">{currentTask?.title}</h3>
                <p className="mt-2 text-sm bread-muted leading-relaxed">{currentTask?.description}</p>
              </div>

              <div className="bread-loaf p-3 shrink-0">
                <TaskChecklist tasks={level.tasks} currentTaskIndex={state.currentTaskIndex} />
              </div>

              {feedback && (
                <div
                  className={`bread-crumb px-4 py-3 text-sm font-medium shrink-0 ${
                    feedback.startsWith('Nice') ? 'text-[#5a7a2a]' : 'text-[#a33b2a]'
                  }`}
                >
                  {feedback}
                </div>
              )}

              {hintText && (
                <div className="bread-crumb px-4 py-3 text-sm bread-strong shrink-0">
                  <div className="text-[9px] uppercase tracking-[0.35em] bread-muted font-pixel">Hint</div>
                  <p className="mt-2">{hintText}</p>
                </div>
              )}
            </div>

            <div className="shrink-0">
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

      <SuccessCastOverlay
        celebrating={showSuccessCast}
        onCelebrateDone={() => setShowSuccessCast(false)}
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
