import { FileCode, FileJson, FileText, Folder } from 'lucide-react';
import type { ProjectFile } from '../../types';

interface Props {
  files: ProjectFile[];
  activeFile: string;
  onSelect: (path: string) => void;
  projectName: string;
}

function iconFor(language: string) {
  if (language === 'javascript' || language === 'typescript') return <FileCode size={14} className="text-gold" />;
  if (language === 'json') return <FileJson size={14} className="text-dim" />;
  return <FileText size={14} className="text-dim" />;
}

export default function FileExplorer({ files, activeFile, onSelect, projectName }: Props) {
  return (
    <nav aria-label="Project files" className="h-full bg-panel border-r border-border overflow-y-auto">
      <div className="px-3 py-3 flex items-center gap-2 text-dim">
        <Folder size={14} />
        <span className="font-mono text-xs uppercase tracking-wide truncate">{projectName}</span>
      </div>
      <ul>
        {files.map((f) => {
          const active = f.path === activeFile;
          return (
            <li key={f.path}>
              <button
                onClick={() => onSelect(f.path)}
                aria-current={active}
                className={`w-full flex items-center gap-2 px-4 py-1.5 text-left font-mono text-sm transition ${
                  active ? 'bg-panelLight text-ink border-l-2 border-xp' : 'text-dim hover:bg-panelLight/60'
                }`}
              >
                {iconFor(f.language)}
                <span className="truncate">{f.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
