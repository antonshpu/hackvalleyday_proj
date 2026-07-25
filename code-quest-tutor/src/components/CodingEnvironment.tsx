import { useEffect, useState } from 'react';
import type { ProjectPlan } from '../types';
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
    const result = await mockValidateCode(code, currentTask);
    setIsChecking(false);
    setFeedback(result.feedback);

    if (result.correct) {
      currentTask.completed = true;
      setCharacterState('JUMPING');
      setTimeout(() => {
        if (isLastTaskInLevel) {
          level.completed = true;
          setCharacterState('CELEBRATING');
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
    <div className="h-full flex flex-col bg-ink-900">
      <PlatformProgressBar
        totalStages={plan.levels.length}
        currentStageIndex={state.currentLevelIndex}
        rewardStars={Math.max(1, Math.round(level.xpReward / 100))}
      />

      <div className="flex-1 min-h-0 flex">
        <div className="w-[15%] min-w-[160px]">
          <FileExplorer levels={plan.levels} currentLevelIndex={state.currentLevelIndex} />
        </div>

        <div className="w-[60%] min-w-0 flex flex-col border-r-2 border-ink-600">
          <div className="flex-1 min-h-0">
            <EditorPanel level={level} code={code} onChange={setCode} />
          </div>
          <div className="h-[38%] shrink-0 grid grid-cols-2 border-t-2 border-ink-600">
            <div className="border-r border-ink-600">
              <OutputPreview code={code} language={level.language} />
            </div>
            <TerminalPanel />
          </div>
        </div>

        <div className="w-[25%] min-w-[260px] flex flex-col gap-3 p-3 overflow-y-auto bg-ink-900">
          <PlatformerTrack
            tasks={level.tasks}
            currentTaskIndex={state.currentTaskIndex}
            characterState={state.characterState}
          />

          {currentTask && (
            <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-3">
              <span className="font-pixel text-[9px] text-gold-400 tracking-wider">
                CURRENT TASK
              </span>
              <p className="text-sm text-parchment-100 mt-1.5 font-medium">{currentTask.title}</p>
              <p className="text-xs text-parchment-300/70 mt-1">{currentTask.description}</p>
            </div>
          )}

          <TaskChecklist tasks={level.tasks} currentTaskIndex={state.currentTaskIndex} />

          {feedback && (
            <div
              className={`text-xs rounded-md px-3 py-2 border ${
                feedback.startsWith('Nice')
                  ? 'border-gold-600 bg-gold-500/10 text-gold-300'
                  : 'border-ember-500 bg-ember-500/10 text-ember-400'
              }`}
            >
              {feedback}
            </div>
          )}

          {hintText && (
            <div className="text-xs rounded-md px-3 py-2 border border-arcane-500 bg-arcane-400/10 text-arcane-300">
              💡 {hintText}
            </div>
          )}

          <div className="mt-auto pt-1">
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

      <StatusFooter
        name={profile.name}
        level={profile.level}
        xpIntoLevel={profile.xpIntoLevel}
        xpForNextLevel={profile.xpForNextLevel}
        projects={profile.projectsCompleted}
        streak={profile.streak}
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
