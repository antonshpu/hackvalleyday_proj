import { useEffect, useMemo, useState } from 'react';
import type { CharacterState, GameState, ProjectBreakdown } from '../../types';
import TopBar from './TopBar';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import TaskChecklist from './TaskChecklist';
import ActionButtons from './ActionButtons';
import OutputPreview from './OutputPreview';
import Terminal, { type TerminalLine } from './Terminal';
import PlatformerCharacter from '../Character/PlatformerCharacter';
import CutsceneOverlay from '../Character/CutsceneOverlay';
import { validateCode, fetchHint } from '../../services/api';
import { X } from 'lucide-react';

interface Props {
  breakdown: ProjectBreakdown;
  setBreakdown: (b: ProjectBreakdown) => void;
  gameState: GameState;
  setCharacterState: (s: CharacterState) => void;
  awardTaskXp: () => void;
  advanceLevel: (achievement?: string) => void;
}

const DEFAULT_HTML = '<canvas id="game"></canvas>';
const DEFAULT_CSS = 'canvas { display:block; margin:0 auto; }';

let logCounter = 0;
function nextLogId() {
  logCounter += 1;
  return `log-${logCounter}`;
}

export default function MainEnvironment({
  breakdown,
  setBreakdown,
  gameState,
  setCharacterState,
  awardTaskXp,
  advanceLevel,
}: Props) {
  const currentLevel = breakdown.levels[gameState.currentLevelIndex] ?? breakdown.levels[breakdown.levels.length - 1];
  const isProjectComplete = gameState.currentLevelIndex >= breakdown.levels.length;

  const [filesContent, setFilesContent] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState(currentLevel?.fileName ?? breakdown.files[0]?.path);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(currentLevel?.tasks[0]?.id ?? null);
  const [checking, setChecking] = useState(false);
  const [hinting, setHinting] = useState(false);
  const [logs, setLogs] = useState<TerminalLine[]>([]);
  const [showCutscene, setShowCutscene] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);

  // Initialize / reset file contents whenever the level changes
  useEffect(() => {
    if (!currentLevel) return;
    setFilesContent((prev) => ({
      'index.html': prev['index.html'] ?? DEFAULT_HTML,
      'style.css': prev['style.css'] ?? DEFAULT_CSS,
      ...prev,
      [currentLevel.fileName]: currentLevel.starterCode,
    }));
    setActiveFile(currentLevel.fileName);
    setActiveTaskId(currentLevel.tasks.find((t) => !t.completed)?.id ?? currentLevel.tasks[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel?.id]);

  const activeFileMeta = breakdown.files.find((f) => f.path === activeFile) ?? breakdown.files[0];
  const activeCode = filesContent[activeFile] ?? '';

  const activeTask = currentLevel?.tasks.find((t) => t.id === activeTaskId) ?? null;

  function pushLog(text: string, kind: TerminalLine['kind']) {
    setLogs((prev) => [...prev, { id: nextLogId(), text, kind }]);
  }

  function updateTaskInBreakdown(levelId: string, taskId: string, patch: Partial<{ completed: boolean; hintsUsed: number }>) {
    setBreakdown({
      ...breakdown,
      levels: breakdown.levels.map((lvl) =>
        lvl.id !== levelId
          ? lvl
          : {
              ...lvl,
              tasks: lvl.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
            }
      ),
    });
  }

  async function handleCheck() {
    if (!currentLevel || !activeTask || checking) return;
    setChecking(true);
    setCharacterState('WALKING');
    pushLog(`Checking task: ${activeTask.description}`, 'system');

    const result = await validateCode({
      code: activeCode,
      taskDescription: activeTask.description,
      levelTitle: currentLevel.title,
    });

    if (result.correct) {
      setCharacterState('JUMPING');
      pushLog(result.feedback, 'success');
      updateTaskInBreakdown(currentLevel.id, activeTask.id, { completed: true });
      awardTaskXp();

      const remaining = currentLevel.tasks.filter((t) => t.id !== activeTask.id && !t.completed);
      setTimeout(() => {
        setCharacterState('IDLE');
        if (remaining.length === 0) {
          setShowCutscene(true);
        } else {
          setActiveTaskId(remaining[0].id);
        }
      }, 650);
    } else {
      setCharacterState('FAILING');
      pushLog(result.feedback, 'error');
      setTimeout(() => setCharacterState('IDLE'), 650);
    }
    setChecking(false);
  }

  async function handleHint() {
    if (!activeTask || hinting) return;
    setHinting(true);
    const result = await fetchHint({
      taskDescription: activeTask.description,
      currentCode: activeCode,
      hintLevel: activeTask.hintsUsed,
    });
    setHintText(result.hint);
    pushLog(`💡 Hint: ${result.hint}`, 'info');
    if (currentLevel) {
      updateTaskInBreakdown(currentLevel.id, activeTask.id, { hintsUsed: activeTask.hintsUsed + 1 });
    }
    setHinting(false);
  }

  function handleCutsceneDone() {
    setShowCutscene(false);
    advanceLevel(`Cleared: ${currentLevel.title}`);
  }

  const gameJsCode = filesContent['game.js'] ?? '';

  const terminalLines = useMemo(() => logs, [logs]);

  if (isProjectComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="pixel-font text-gold text-lg">🏆 QUEST COMPLETE</p>
        <p className="font-mono text-ink">You finished every level of "{breakdown.projectName}".</p>
        <p className="font-mono text-xp">Total XP: {gameState.xp}</p>
      </div>
    );
  }

  if (!currentLevel) return null;

  return (
    <div className="h-screen flex flex-col">
      <TopBar
        projectName={breakdown.projectName}
        xp={gameState.xp}
        levelNumber={gameState.currentLevelIndex + 1}
        totalLevels={breakdown.levels.length}
        elapsedSeconds={gameState.elapsedSeconds}
      />

      <div className="flex-1 min-h-0 flex">
        <div style={{ width: '15%' }} className="min-w-[160px]">
          <FileExplorer
            files={breakdown.files}
            activeFile={activeFile}
            onSelect={setActiveFile}
            projectName={breakdown.projectName}
          />
        </div>

        <div style={{ width: '60%' }} className="min-w-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <CodeEditor
              key={activeFile}
              code={activeCode}
              language={activeFileMeta?.language ?? 'javascript'}
              fileName={activeFileMeta?.name ?? activeFile}
              onChange={(val) => setFilesContent((prev) => ({ ...prev, [activeFile]: val }))}
            />
          </div>
          <div className="h-48 shrink-0 flex border-t border-border">
            <div className="w-1/2 min-w-0">
              <OutputPreview html={filesContent['index.html'] ?? DEFAULT_HTML} css={filesContent['style.css'] ?? DEFAULT_CSS} js={gameJsCode} />
            </div>
            <div className="w-1/2 min-w-0">
              <Terminal lines={terminalLines} />
            </div>
          </div>
        </div>

        <div style={{ width: '25%' }} className="min-w-[280px] bg-void border-l border-border p-3 flex flex-col gap-3 overflow-y-auto">
          <PlatformerCharacter tasks={currentLevel.tasks} characterState={gameState.characterState} levelTitle={currentLevel.title} />
          <TaskChecklist tasks={currentLevel.tasks} activeTaskId={activeTaskId} onSelectTask={setActiveTaskId} />
          {hintText && (
            <div className="font-mono text-xs text-gold bg-panel border border-border rounded-sm p-2">
              💡 {hintText}
            </div>
          )}
          <ActionButtons onCheck={handleCheck} onHint={handleHint} onResources={() => setShowResources(true)} checking={checking} hinting={hinting} />
        </div>
      </div>

      {showCutscene && (
        <CutsceneOverlay levelTitle={currentLevel.title} xpGained={100} onDone={handleCutsceneDone} />
      )}

      {showResources && (
        <div className="fixed inset-0 z-40 bg-void/80 flex items-center justify-center p-4" role="dialog" aria-label="Resources">
          <div className="pixel-panel bg-panel rounded-sm p-5 max-w-md w-full">
            <div className="flex items-center justify-between mb-3">
              <p className="pixel-font text-[10px] text-gold">RESOURCES</p>
              <button onClick={() => setShowResources(false)} aria-label="Close resources" className="text-dim hover:text-ink">
                <X size={16} />
              </button>
            </div>
            <ul className="font-mono text-sm text-ink space-y-2 list-disc list-inside">
              <li>MDN Web Docs — developer.mozilla.org</li>
              <li>JavaScript.info — a modern JS tutorial</li>
              <li>Canvas API guide — for drawing game graphics</li>
              <li>Re-read the current task's TASK comment for the exact ask</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
