import { CharacterSprite } from './CharacterSprite';
import type { CharacterState, Task } from '../types';

interface Props {
  tasks: Task[];
  currentTaskIndex: number;
  characterState: CharacterState;
}

export function PlatformerTrack({ tasks, currentTaskIndex, characterState }: Props) {
  const totalTasks = tasks.length;
  // Calculate percentage progress along the track to position the character smoothly
  const progressPercent = totalTasks > 1 ? (currentTaskIndex / (totalTasks - 1)) * 100 : 0;

  return (
    <div className="relative bg-ink-800 border-2 border-ink-600 rounded-md p-4 pb-8 overflow-hidden">
      {/* ambient stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold-300"
            style={{
              width: 2,
              height: 2,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 60}%`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Map Track Layer */}
      <div className="absolute bottom-6 left-4 right-4 h-10 rounded-full bg-ink-900 pointer-events-none opacity-95 z-0" />
      <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between pointer-events-none z-0 px-4">
        {tasks.map((_, i) => (
          <div key={i} className="h-8 w-0.5 rounded-full bg-ink-700" />
        ))}
      </div>

      {/* Sliding Character Runner across the map */}
      <div 
        className="absolute bottom-6 transition-all duration-500 ease-out z-20 pointer-events-none"
        style={{ left: `calc(1rem + ${progressPercent}% * 0.85 - 24px)` }}
      >
        <CharacterSprite state={characterState} size={48} />
      </div>

      <div className="relative flex items-end gap-3 min-h-[128px] z-10">
        {tasks.map((task, i) => {
          const isCurrent = i === currentTaskIndex;
          const isDone = task.completed;
          return (
            <div key={task.id} className="flex flex-col items-center flex-1 min-w-0">
              <div className="h-16 flex items-end justify-center w-full relative">
                {/* Checkpoint marker pin or node indicator */}
                <div 
                  className={`w-3 h-3 rounded-full border-2 transition-all ${
                    isDone 
                      ? 'bg-gold-400 border-gold-600 shadow-[0_0_8px_rgba(234,179,8,0.6)]' 
                      : isCurrent 
                      ? 'bg-arcane-400 border-arcane-200 animate-pulse' 
                      : 'bg-ink-700 border-ink-600'
                  }`} 
                />
              </div>
              <div
                className={`w-full h-4 rounded-sm border-2 ${
                  isDone
                    ? 'bg-gold-500 border-gold-700'
                    : isCurrent
                    ? 'bg-arcane-400 border-arcane-500'
                    : 'bg-ink-600 border-ink-700'
                }`}
                title={task.title}
              />
              <span className="mt-1 text-[9px] font-mono text-parchment-300 truncate w-full text-center">
                {i + 1}. {task.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}