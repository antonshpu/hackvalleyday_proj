export type CharacterState =
  | 'IDLE'
  | 'WALKING'
  | 'PUSHING'
  | 'JUMPING'
  | 'FALLING'
  | 'CELEBRATING'
  | 'FAILING'
  | 'CASTING';

export interface Task {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solutionHint: string[];
  taskMarker: string;
  completed: boolean;
}

export interface Level {
  id: string;
  index: number;
  title: string;
  summary: string;
  language: 'javascript' | 'html' | 'css' | 'typescript';
  fileName: string;
  boilerplate: string;
  tasks: Task[];
  xpReward: number;
  completed: boolean;
}

export interface ProjectPlan {
  projectName: string;
  description: string;
  levels: Level[];
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  active?: boolean;
}

export interface ValidationResult {
  correct: boolean;
  feedback: string;
  matchedTasks: string[];
  errorLines?: number[];
  errorMessage?: string;
  errors?: { message: string; line: number }[];
}

export interface HintResult {
  hint: string;
  hintLevel: number;
}

export interface GameState {
  xp: number;
  currentLevelIndex: number;
  currentTaskIndex: number;
  startedAt: number;
  characterState: CharacterState;
  achievements: string[];
}
