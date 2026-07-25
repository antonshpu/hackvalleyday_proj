import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const PROMPT = '\x1b[38;5;180m➜\x1b[0m  ';

export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const lineBuffer = useRef('');

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#12100C',
        foreground: '#EDE6D6',
        cursor: '#F0CD7A',
      },
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      cursorBlink: true,
      convertEol: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();

    term.writeln('Code Quest Terminal — type `run` to execute your code, `help` for commands.');
    term.write(PROMPT);

    const disposable = term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.key === 'Enter') {
        const cmd = lineBuffer.current.trim();
        term.write('\r\n');
        handleCommand(cmd, term);
        lineBuffer.current = '';
        term.write(PROMPT);
      } else if (domEvent.key === 'Backspace') {
        if (lineBuffer.current.length > 0) {
          lineBuffer.current = lineBuffer.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (printable && key.length === 1) {
        lineBuffer.current += key;
        term.write(key);
      }
    });

    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);

    termRef.current = term;

    return () => {
      disposable.dispose();
      window.removeEventListener('resize', onResize);
      term.dispose();
    };
  }, []);

  function handleCommand(cmd: string, term: Terminal) {
    if (cmd === 'run') {
      term.writeln('Running your code… see Live Preview panel for output.');
    } else if (cmd === 'clear') {
      term.clear();
    } else if (cmd === 'help') {
      term.writeln('Available: run, clear, help');
    } else if (cmd.length === 0) {
      // no-op
    } else {
      term.writeln(`command not found: ${cmd}`);
    }
  }

  return (
    <div className="h-full flex flex-col bg-ink-950">
      <div className="h-8 shrink-0 flex items-center px-3 bg-ink-800 border-b border-ink-600">
        <span className="text-[10px] font-pixel text-parchment-300/70">TERMINAL</span>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0 px-2 py-1" />
    </div>
  );
}
