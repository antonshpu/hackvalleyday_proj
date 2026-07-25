export type CharacterState =
  | 'IDLE'
  | 'WALKING'
  | 'JUMPING'
  | 'FALLING'
  | 'CELEBRATING'
  | 'FAILING';

export interface Task {
  id: string;
  description: string;
  /** Line marker text the AI/editor looks for, e.g. "// 🟡 TASK: create the bird object" */
  marker: string;
  completed: boolean;
  hintsUsed: number;
}

export interface Level {
  id: string;
  title: string;
  summary: string;
  tasks: Task[];
  /** Starter code shown in the editor for this level, with TASK markers embedded */
  starterCode: string;
  fileName: string;
  completed: boolean;
}

export interface ProjectFile {
  name: string;
  path: string;
  language: string;
}

export interface ProjectBreakdown {
  projectName: string;
  description: string;
  files: ProjectFile[];
  levels: Level[];
}

export interface ValidationResult {
  correct: boolean;
  feedback: string;
  /** 0-1, used to decide partial-credit animations later if desired */
  confidence: number;
}

export interface HintResult {
  hint: string;
  hintLevel: number;
}

export interface GameState {
  xp: number;
  currentLevelIndex: number;
  startedAt: number;
  elapsedSeconds: number;
  achievements: string[];
  characterState: CharacterState;
}

export type ApiMode = 'mock' | 'live';
