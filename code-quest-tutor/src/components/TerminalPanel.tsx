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
        background: '#f8edd4',
        foreground: '#3b2415',
        cursor: '#8b4e24',
        selectionBackground: '#c47a3a55',
      },
      fontFamily: '"Press Start 2P", monospace',
      fontSize: 10,
      lineHeight: 16,
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
    <div className="h-full flex flex-col bg-[#f8edd4] overflow-hidden">
      <div className="h-10 shrink-0 flex items-center justify-between px-3 bg-[#f0d9a8] border-b-[3px] border-[#8b4e24]/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#a33b2a]" />
          <span className="w-2 h-2 rounded-full bg-[#f0d264]" />
          <span className="w-2 h-2 rounded-full bg-[#5a9e3e]" />
          <span className="text-[9px] font-pixel tracking-widest text-[#5c3a22]">TERMINAL</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => termRef.current?.writeln('Running your code… see Live Preview panel for output.')}
            className="rounded-md border-[2px] border-[#8b4e24] bg-[#f0d264] px-2 py-1 text-[8px] font-pixel text-[#3b2415] hover:brightness-105"
          >
            RUN
          </button>
          <button
            type="button"
            onClick={() => termRef.current?.clear()}
            className="rounded-md border-[2px] border-[#8b4e24] bg-[#f8edd4] px-2 py-1 text-[8px] font-pixel text-[#5c3a22] hover:bg-[#f0d9a8]"
          >
            CLEAR
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 px-3 py-2">
        <div
          ref={containerRef}
          className="h-full rounded-xl border-[2px] border-[#8b4e24]/60 bg-[#f8edd4]"
        />
      </div>
    </div>
  );
}
