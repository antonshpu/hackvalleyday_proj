import Editor, { OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import type { Level, Task } from '../types';

interface Props {
  level: Level;
  code: string;
  onChange: (value: string) => void;
  validationErrors: { message: string; lines: number[] } | null;
  currentTask?: Task | null;
}

export function EditorPanel({ level, code, onChange, validationErrors, currentTask }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationIds = useRef<string[]>([]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    updateDecorations(editor, monaco, validationErrors);
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    updateDecorations(editorRef.current, monacoRef.current, validationErrors);
  }, [validationErrors]);

  function updateDecorations(
    editor: Parameters<OnMount>[0],
    monaco: Parameters<OnMount>[1],
    errors: { message: string; lines: number[] } | null
  ) {
    const model = editor.getModel();
    if (!model) return;
    const lines = model.getLinesContent();
    const taskDecorations = lines
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

    const errorDecorations = errors
      ? errors.lines.map((line) => {
          const endColumn = model.getLineMaxColumn(line);
          return {
            range: new monaco.Range(line, endColumn, line, endColumn),
            options: {
              isWholeLine: true,
              className: 'error-line-highlight',
              glyphMarginClassName: 'error-glyph',
              after: {
                contentText: ` ✖ ${errors.message}`,
                inlineClassName: 'error-bubble-text',
              },
            },
          };
        })
      : [];

    decorationIds.current = editor.deltaDecorations(decorationIds.current, [
      ...taskDecorations,
      ...errorDecorations,
    ]);
  }

  return (
    <div className="h-full flex flex-col bg-[#11100E]">
      <div className="h-auto shrink-0 bg-ink-900 border-b border-ink-700 px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-pixel uppercase tracking-[0.35em] text-gold-300 truncate">
              {level.fileName}
            </div>
            <div className="mt-1 text-[10px] text-parchment-300/80 truncate">
              {currentTask ? `Task: ${currentTask.title}` : `Write code for ${level.title}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-ink-800 px-2 py-1 text-[10px] text-parchment-400 border border-ink-700">
              ● unsaved
            </span>
            <span className="w-2 h-2 rounded-full bg-ember-500" />
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span className="w-2 h-2 rounded-full bg-arcane-400" />
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
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
            padding: { top: 12, bottom: 10 },
            renderLineHighlight: 'gutter',
            lineNumbers: 'on',
          }}
        />
      </div>
      <style>{`
        .task-line-highlight {
          background: rgba(240, 205, 122, 0.12);
          border-left: 3px solid #f0cd7a;
        }
        .task-glyph::before {
          content: '🟡';
          font-size: 11px;
          margin-left: 4px;
        }
        .error-line-highlight {
          background: rgba(218, 107, 69, 0.16);
          border-left: 3px solid #da6b45;
        }
        .error-glyph::before {
          content: '❗';
          color: #da6b45;
          font-size: 11px;
          margin-left: 4px;
        }
        .error-bubble-text {
          color: #ffffff;
          background: #c2410c;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
          margin-left: 10px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
}
