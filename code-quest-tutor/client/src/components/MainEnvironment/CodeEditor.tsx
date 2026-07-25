import Editor, { type OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import type * as MonacoNS from 'monaco-editor';

interface Props {
  code: string;
  onChange: (value: string) => void;
  language: string;
  fileName: string;
}

type Monaco = typeof MonacoNS;
type IStandaloneCodeEditor = MonacoNS.editor.IStandaloneCodeEditor;

/**
 * Figures out which lines are "editable" (inside a task) vs read-only
 * boilerplate, based on `// 🟡 TASK:` markers in the code.
 *
 * A task's editable zone runs from its marker line to the next blank line
 * that's followed by a line at the same or lower indentation (a rough but
 * effective heuristic for "end of this code block"), or to the end of the
 * file if none is found.
 */
function computeEditableRanges(code: string): { start: number; end: number }[] {
  const lines = code.split('\n');
  const ranges: { start: number; end: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes('🟡 TASK')) continue;
    let end = lines.length - 1;
    for (let j = i + 1; j < lines.length; j++) {
      const isBlank = lines[j].trim() === '';
      const next = lines[j + 1];
      if (isBlank && (next === undefined || /^[}\w]/.test(next))) {
        end = j;
        break;
      }
    }
    ranges.push({ start: i, end });
  }
  return ranges;
}

export default function CodeEditor({ code, onChange, language, fileName }: Props) {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const lastGoodValueRef = useRef(code);
  const revertingRef = useRef(false);

  function applyDecorations(editor: IStandaloneCodeEditor, monaco: Monaco) {
    const model = editor.getModel();
    if (!model) return;
    const ranges = computeEditableRanges(model.getValue());
    const editableLineSet = new Set<number>();
    ranges.forEach((r) => {
      for (let l = r.start; l <= r.end; l++) editableLineSet.add(l);
    });

    const decorations: MonacoNS.editor.IModelDeltaDecoration[] = [];
    const totalLines = model.getLineCount();
    for (let line = 0; line < totalLines; line++) {
      const isEditable = editableLineSet.has(line);
      decorations.push({
        range: new monaco.Range(line + 1, 1, line + 1, 1),
        options: {
          isWholeLine: true,
          className: isEditable ? 'task-line-highlight' : 'readonly-line',
          linesDecorationsClassName: isEditable ? 'task-gutter-marker' : undefined,
        },
      });
    }
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations);
  }

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    lastGoodValueRef.current = editor.getValue();
    applyDecorations(editor, monaco);

    editor.onDidChangeModelContent((e) => {
      if (revertingRef.current) return;
      const model = editor.getModel();
      if (!model) return;

      const ranges = computeEditableRanges(lastGoodValueRef.current);
      const violatesReadOnly = e.changes.some((change) => {
        const changedStartLine = change.range.startLineNumber - 1;
        const changedEndLine = change.range.endLineNumber - 1;
        // Allowed if the entire changed span sits within (or directly extends) an editable zone.
        return !ranges.some((r) => changedStartLine >= r.start - 1 && changedEndLine <= r.end + 1);
      });

      if (violatesReadOnly) {
        revertingRef.current = true;
        const value = lastGoodValueRef.current;
        const fullRange = model.getFullModelRange();
        editor.executeEdits('guard', [{ range: fullRange, text: value }]);
        revertingRef.current = false;
        applyDecorations(editor, monaco);
        return;
      }

      lastGoodValueRef.current = model.getValue();
      onChange(model.getValue());
      applyDecorations(editor, monaco);
    });
  };

  // Reset editor content when switching files/levels
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (editor && monaco && editor.getValue() !== code) {
      lastGoodValueRef.current = code;
      editor.setValue(code);
      applyDecorations(editor, monaco);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, fileName]);

  return (
    <div className="h-full flex flex-col bg-panel">
      <div className="h-9 shrink-0 flex items-center px-4 border-b border-border font-mono text-xs text-dim">
        {fileName}
        <span className="ml-2 text-gold">● unsaved</span>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          defaultValue={code}
          onMount={handleMount}
          options={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            padding: { top: 12 },
            automaticLayout: true,
            accessibilitySupport: 'on',
          }}
        />
      </div>
      <style>{`
        .task-line-highlight { background-color: rgba(240, 210, 100, 0.10); }
        .readonly-line { opacity: 0.6; }
        .task-gutter-marker::before {
          content: '🟡';
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}
