import { CheckCircle2, Circle } from 'lucide-react';
import type { Task } from '../../types';

interface Props {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

export default function TaskChecklist({ tasks, activeTaskId, onSelectTask }: Props) {
  return (
    <div className="pixel-panel bg-panel rounded-sm p-3">
      <p className="pixel-font text-[9px] text-dim mb-3">TASKS</p>
      <ul className="space-y-2">
        {tasks.map((task) => {
          const active = task.id === activeTaskId;
          return (
            <li key={task.id}>
              <button
                onClick={() => onSelectTask(task.id)}
                className={`w-full flex items-start gap-2 text-left px-2 py-1.5 rounded-sm font-mono text-xs transition ${
                  active ? 'bg-panelLight border-l-2 border-gold text-ink' : 'text-dim hover:text-ink'
                }`}
              >
                {task.completed ? (
                  <CheckCircle2 size={14} className="text-xp mt-0.5 shrink-0" aria-hidden="true" />
                ) : (
                  <Circle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                )}
                <span className={task.completed ? 'line-through decoration-xp/60' : ''}>{task.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
