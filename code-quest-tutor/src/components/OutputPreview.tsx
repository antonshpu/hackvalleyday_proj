import { useMemo } from 'react';

interface Props {
  code: string;
  language: string;
}

function buildDocument(code: string, language: string) {
  if (language === 'html') {
    return code;
  }
  // Wrap JS/TS in a minimal HTML shell with a captured console.
  return `<!doctype html>
  <html>
    <head>
      <style>
        body { font-family: 'IBM Plex Sans', sans-serif; background: #f8edd4; color: #3b2415; margin: 0; padding: 12px; font-size: 13px; }
        #console-log div { padding: 3px 0; border-bottom: 1px solid #c47a3a55; font-family: 'JetBrains Mono', monospace; }
        canvas { background: #f0d9a8; border: 2px solid #8b4e24; }
      </style>
    </head>
    <body>
      <canvas id="game" width="320" height="480"></canvas>
      <div id="app"></div>
      <div id="console-log"></div>
      <script>
        const logEl = document.getElementById('console-log');
        const origLog = console.log;
        console.log = (...args) => {
          origLog(...args);
          const div = document.createElement('div');
          div.textContent = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          logEl.appendChild(div);
        };
        window.onerror = (msg) => {
          const div = document.createElement('div');
          div.style.color = '#DA6B45';
          div.textContent = 'Error: ' + msg;
          logEl.appendChild(div);
        };
        try {
          ${code}
        } catch (err) {
          console.log('Error: ' + err.message);
        }
      </script>
    </body>
  </html>`;
}

export function OutputPreview({ code, language }: Props) {
  const doc = useMemo(() => buildDocument(code, language), [code, language]);

  return (
    <div className="h-full flex flex-col bg-[#f8edd4]">
      <div className="h-10 shrink-0 flex items-center justify-between px-4 bg-[#f0d9a8] border-b-[3px] border-[#8b4e24]/70">
        <span className="text-[10px] font-pixel uppercase tracking-[0.35em] text-[#5c3a22]">
          Output
        </span>
        <span className="text-[10px] font-mono text-[#7a5230] font-semibold">{language.toUpperCase()}</span>
      </div>
      <iframe
        title="Live output preview"
        className="flex-1 w-full bg-[#f8edd4]"
        sandbox="allow-scripts"
        srcDoc={doc}
      />
    </div>
  );
}
