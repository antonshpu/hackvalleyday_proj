import type { Task } from '../types';

interface Props {
  tasks: Task[];
  currentTaskIndex: number;
}

export function TaskChecklist({ tasks, currentTaskIndex }: Props) {
  return (
    <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-3">
      <span className="font-pixel text-[9px] text-parchment-300/70 tracking-wider">
        LEVEL TASKS
      </span>
      <ul className="mt-2 space-y-1.5">
        {tasks.map((task, i) => (
          <li
            key={task.id}
            className={`flex items-start gap-2 text-xs rounded px-2 py-1.5 ${
              i === currentTaskIndex ? 'bg-arcane-400/10' : ''
            }`}
          >
            <span aria-hidden className="mt-[1px]">
              {task.completed ? '✅' : i === currentTaskIndex ? '🟡' : '⬜'}
            </span>
            <span
              className={
                task.completed
                  ? 'line-through text-parchment-300/40'
                  : i === currentTaskIndex
                  ? 'text-parchment-100'
                  : 'text-parchment-300/50'
              }
            >
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
