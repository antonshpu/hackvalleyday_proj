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
        body { font-family: 'IBM Plex Sans', sans-serif; background: #0B0A08; color: #EDE6D6; margin: 0; padding: 12px; font-size: 13px; }
        #console-log div { padding: 3px 0; border-bottom: 1px solid #241F18; font-family: 'JetBrains Mono', monospace; }
        canvas { background: #12100C; border: 1px solid #332C21; }
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
    <div className="h-full flex flex-col bg-ink-900">
      <div className="h-8 shrink-0 flex items-center px-3 bg-ink-800 border-b border-ink-600">
        <span className="text-[10px] font-pixel text-parchment-300/70">LIVE PREVIEW</span>
      </div>
      <iframe
        title="Live output preview"
        className="flex-1 w-full bg-white"
        sandbox="allow-scripts"
        srcDoc={doc}
      />
    </div>
  );
}
