import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
  html: string;
  css: string;
  js: string;
}

export default function OutputPreview({ html, css, js }: Props) {
  const [key, setKey] = useState(0);

  const srcDoc = useMemo(() => {
    const bodyHtml = html || '<canvas id="game"></canvas>';
    return `<!doctype html><html><head><style>
      body { margin:0; background:#0a0e14; display:flex; align-items:center; justify-content:center; height:100vh; }
      canvas { background:#181d29; border:2px solid #242b3a; }
      ${css}
    </style></head><body>${bodyHtml}
    <script>
      window.onerror = function(msg) {
        parent.postMessage({ source: 'code-quest-preview', type: 'error', message: String(msg) }, '*');
      };
      try {
        ${js}
      } catch (err) {
        parent.postMessage({ source: 'code-quest-preview', type: 'error', message: err.message }, '*');
      }
    </script>
    </body></html>`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, css, js, key]);

  return (
    <div className="h-full flex flex-col bg-panel border-r border-border">
      <div className="h-8 shrink-0 flex items-center justify-between px-3 border-b border-border">
        <span className="font-mono text-xs text-dim">Live Preview</span>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="text-dim hover:text-ink transition"
          aria-label="Reload preview"
        >
          <RefreshCw size={13} />
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <iframe
          key={key}
          title="Live code preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          className="w-full h-full bg-void"
        />
      </div>
    </div>
  );
}
