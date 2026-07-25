import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export interface TerminalLine {
  id: string;
  text: string;
  kind: 'info' | 'success' | 'error' | 'system';
}

interface Props {
  lines: TerminalLine[];
}

const COLORS: Record<TerminalLine['kind'], string> = {
  info: '\x1b[37m',
  success: '\x1b[32m',
  error: '\x1b[31m',
  system: '\x1b[90m',
};
const RESET = '\x1b[0m';

export default function Terminal({ lines }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const writtenCountRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const term = new XTerm({
      convertEol: true,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      theme: {
        background: '#0a0e14',
        foreground: '#c9d1d9',
        cursor: '#7ee787',
      },
      cursorBlink: false,
      disableStdin: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    term.writeln('\x1b[90m$ code-quest-tutor terminal — ready\x1b[0m');

    termRef.current = term;
    fitRef.current = fit;

    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      term.dispose();
    };
  }, []);

  useEffect(() => {
    const term = termRef.current;
    if (!term) return;
    const newLines = lines.slice(writtenCountRef.current);
    newLines.forEach((line) => {
      term.writeln(`${COLORS[line.kind]}${line.text}${RESET}`);
    });
    writtenCountRef.current = lines.length;
  }, [lines]);

  return (
    <div className="h-full flex flex-col bg-void">
      <div className="h-8 shrink-0 flex items-center px-3 border-b border-border">
        <span className="font-mono text-xs text-dim">Terminal</span>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0 px-2 py-1" />
    </div>
  );
}
