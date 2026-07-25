import type { Task } from '../types';

interface Props {
  tasks: Task[];
  currentTaskIndex: number;
}

export function TaskChecklist({ tasks, currentTaskIndex }: Props) {
  return (
    <div>
      <span className="font-pixel text-[9px] text-[#5c3a22] tracking-wider">LEVEL TASKS</span>
      <ul className="mt-2 space-y-1.5">
        {tasks.map((task, i) => (
          <li
            key={task.id}
            className={`flex items-start gap-2 text-xs rounded-lg px-2 py-1.5 ${
              i === currentTaskIndex ? 'bg-[#c47a3a]/20 border border-[#8b4e24]/50' : ''
            }`}
          >
            <span aria-hidden className="mt-[1px]">
              {task.completed ? '✅' : i === currentTaskIndex ? '🟡' : '⬜'}
            </span>
            <span
              className={
                task.completed
                  ? 'line-through text-[#7a5230]/55'
                  : i === currentTaskIndex
                    ? 'text-[#3b2415] font-semibold'
                    : 'text-[#7a5230]'
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
