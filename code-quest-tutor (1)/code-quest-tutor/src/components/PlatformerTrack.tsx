import { CharacterSprite } from './CharacterSprite';
import type { CharacterState, Task } from '../types';

interface Props {
  tasks: Task[];
  currentTaskIndex: number;
  characterState: CharacterState;
}

export function PlatformerTrack({ tasks, currentTaskIndex, characterState }: Props) {
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

      <div className="relative flex items-end gap-3 min-h-[128px]">
        {tasks.map((task, i) => {
          const isCurrent = i === currentTaskIndex;
          const isDone = task.completed;
          return (
            <div key={task.id} className="flex flex-col items-center flex-1 min-w-0">
              <div className="h-16 flex items-end justify-center w-full relative">
                {isCurrent && (
                  <div className="absolute -top-4 flex flex-col items-center">
                    <CharacterSprite state={characterState} size={64} />
                  </div>
                )}
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
