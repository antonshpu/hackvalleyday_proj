import Editor, { OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import type { Level } from '../types';

interface Props {
  level: Level;
  code: string;
  onChange: (value: string) => void;
}

export function EditorPanel({ level, code, onChange }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationIds = useRef<string[]>([]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    highlightTaskLines(editor, monaco);
  };

  function highlightTaskLines(
    editor: Parameters<OnMount>[0],
    monaco: Parameters<OnMount>[1]
  ) {
    const model = editor.getModel();
    if (!model) return;
    const lines = model.getLinesContent();
    const newDecorations = lines
      .map((line, idx) => ({ line, idx }))
      .filter(({ line }) => line.includes('🟡 TASK'))
      .map(({ idx }) => ({
        range: new monaco.Range(idx + 1, 1, idx + 1, 1),
        options: {
          isWholeLine: true,
          className: 'task-line-highlight',
          glyphMarginClassName: 'task-glyph',
        },
      }));
    decorationIds.current = editor.deltaDecorations(decorationIds.current, newDecorations);
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="h-9 shrink-0 flex items-center px-3 bg-ink-800 border-b border-ink-600 gap-2">
        <span className="text-xs font-mono text-parchment-300/70">{level.fileName}</span>
        <span className="text-[10px] font-mono text-gold-500/70">● unsaved</span>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={level.language === 'html' ? 'html' : level.language}
          value={code}
          theme="vs-dark"
          onMount={handleMount}
          onChange={(v) => onChange(v ?? '')}
          options={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            minimap: { enabled: false },
            glyphMargin: true,
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            renderLineHighlight: 'gutter',
          }}
        />
      </div>
      <style>{`
        .task-line-highlight {
          background: rgba(240, 205, 122, 0.12);
          border-left: 3px solid #F0CD7A;
        }
        .task-glyph::before {
          content: '🟡';
          font-size: 11px;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
