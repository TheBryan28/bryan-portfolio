import { Check, Sparkles, X } from 'lucide-react';

// Illustrated mini-interfaces for each piece of work. They are drawings of how
// the features behave, not screenshots. Each one plays a short GSAP sequence
// once the cursor crew has placed its tile (see playVisual).

export function NovaVisual() {
  const modules = ['Variables and types', 'Control flow', 'Functions', 'Working with files'];
  return (
    <div className="viz viz-nova" data-visual="nova">
      <div className="nova-input">
        <span className="mono">Topic</span>
        <strong>Intro to Python</strong>
        <span className="nova-file">syllabus.pdf</span>
      </div>
      <div className="nova-arrow" aria-hidden="true">→</div>
      <ol className="nova-outline">
        {modules.map((m, i) => (
          <li key={m}>
            <span className="nova-check">
              <Check size={11} strokeWidth={3} aria-hidden="true" />
            </span>
            <span>
              Section {i + 1} · {m}
            </span>
            <span className="nova-kinds">
              <i>Page</i>
              {i % 2 === 0 ? <i>Quiz</i> : <i>Forum</i>}
              {i === 3 && <i>Assignment</i>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function EditorVisual() {
  return (
    <div className="viz viz-editor" data-visual="editor">
      <div className="ed-toolbar" aria-hidden="true">
        <b>B</b>
        <i>I</i>
        <u>U</u>
        <span className="ed-sep" />
        <span className="ed-ai">
          <Sparkles size={12} aria-hidden="true" /> AI
        </span>
      </div>
      <div className="ed-body">
        <span className="ed-line w90" />
        <span className="ed-line w70" />
        <div className="ed-pop">
          <span className="mono">Prompt</span>
          <p>Summarize this lesson for first-year students</p>
        </div>
        <p className="ed-typed">Photosynthesis turns light, water and CO₂ into the sugar a plant lives on.</p>
      </div>
    </div>
  );
}

export function HubVisual() {
  const providers = [
    { name: 'OpenAI', x: 40, y: 34 },
    { name: 'Anthropic', x: 280, y: 34 },
    { name: 'Gemini', x: 40, y: 156 },
    { name: 'DeepSeek', x: 280, y: 156 },
  ];
  return (
    <div className="viz viz-hub" data-visual="hub">
      <svg viewBox="0 0 360 190" role="img" aria-label="One AI layer connected to four model providers">
        {providers.map((p) => (
          <line key={p.name} className="hub-wire" x1="180" y1="95" x2={p.x + 0} y2={p.y} />
        ))}
        {providers.map((p) => (
          <g key={`${p.name}-n`} className="hub-node">
            <rect x={p.x - 40} y={p.y - 14} width="80" height="28" rx="14" />
            <text x={p.x} y={p.y + 4} textAnchor="middle">
              {p.name}
            </text>
          </g>
        ))}
        <g className="hub-core">
          <rect x="112" y="76" width="136" height="38" rx="10" />
          <text x="180" y="99" textAnchor="middle">
            AI layer
          </text>
        </g>
      </svg>
    </div>
  );
}

export function ChartVisual() {
  const rows = [
    { label: 'Customer-reported issues', before: 57, after: 43, max: 57 },
    { label: 'High-priority issues', before: 11, after: 3, max: 11 },
  ];
  return (
    <div className="viz viz-chart" data-visual="chart">
      {rows.map((r) => (
        <div className="chart-row" key={r.label}>
          <span className="chart-label">{r.label}</span>
          <div className="chart-bars">
            <div className="bar before" style={{ width: `${(r.before / r.max) * 100}%` }}>
              <span>{r.before}</span>
            </div>
            <div className="bar after" style={{ width: `${Math.max((r.after / r.max) * 100, 6)}%` }}>
              <span>{r.after}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="chart-legend mono">
        <span>
          <i className="swatch before" /> Jul 2024 – Jun 2025
        </span>
        <span>
          <i className="swatch after" /> Year after the refactor
        </span>
      </div>
    </div>
  );
}

export function PipelineVisual() {
  const stages = ['build', 'lint', 'phpunit', 'behat'];
  return (
    <div className="viz viz-pipe" data-visual="pipe">
      <div className="pipe-stages">
        {stages.map((s, i) => (
          <div key={s} className={`stage${i >= 2 ? ' flaky' : ''}`}>
            <span className="stage-icon ok">
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            {i >= 2 && (
              <span className="stage-icon bad">
                <X size={12} strokeWidth={3} aria-hidden="true" />
              </span>
            )}
            <span className="mono">{s}</span>
          </div>
        ))}
      </div>
      <div className="pipe-comment">
        <span className="mono">ai-review bot</span>
        <p>3 Behat failures are UI label changes, not regressions. Suggested fix posted on line 214.</p>
      </div>
    </div>
  );
}

export function TerminalVisual() {
  const lines = [
    '$ /start-ticket TICKET-42',
    '✓ read the ticket and its target release',
    '✓ created a branch from the right release line',
    '→ understand-ticket: 2 questions before coding',
  ];
  return (
    <div className="viz viz-term" data-visual="term">
      <div className="term-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="mono">claude code</span>
      </div>
      <div className="term-body mono">
        {lines.map((l) => (
          <div key={l} className="term-line">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

// Small diagrams for the side projects.
export function ProjectArt({ kind }: { kind: 'wallet' | 'services' | 'flow' }) {
  if (kind === 'wallet') {
    return (
      <svg className="proj-art" viewBox="0 0 320 120" aria-hidden="true">
        <rect x="24" y="12" width="64" height="100" rx="10" className="a-frame" />
        <rect x="34" y="28" width="44" height="6" rx="3" className="a-soft" />
        <rect x="34" y="40" width="36" height="6" rx="3" className="a-soft" />
        <rect x="34" y="52" width="40" height="6" rx="3" className="a-flag" />
        <rect x="34" y="64" width="30" height="6" rx="3" className="a-soft" />
        <path d="M100 62 H150" className="a-wire" />
        <rect x="152" y="40" width="96" height="44" rx="10" className="a-node" />
        <text x="200" y="66" textAnchor="middle" className="a-text">Bedrock + RAG</text>
        <path d="M250 62 H272" className="a-wire" />
        <circle cx="288" cy="62" r="14" className="a-flag-dot" />
        <text x="288" y="67" textAnchor="middle" className="a-text strong">!</text>
      </svg>
    );
  }
  if (kind === 'services') {
    const nodes = [
      { x: 230, y: 24, t: 'Catalog' },
      { x: 230, y: 62, t: 'Orders' },
      { x: 230, y: 100, t: 'Search' },
    ];
    return (
      <svg className="proj-art" viewBox="0 0 320 120" aria-hidden="true">
        <rect x="16" y="44" width="64" height="32" rx="8" className="a-node" />
        <text x="48" y="64" textAnchor="middle" className="a-text">React</text>
        <path d="M80 60 H112" className="a-wire" />
        <rect x="112" y="40" width="80" height="40" rx="8" className="a-frame" />
        <text x="152" y="64" textAnchor="middle" className="a-text strong">Gateway</text>
        {nodes.map((n) => (
          <g key={n.t}>
            <path d={`M192 60 C210 60 206 ${n.y} 196 ${n.y}`} className="a-wire" />
            <rect x={n.x - 34} y={n.y - 12} width="84" height="24" rx="12" className="a-node" />
            <text x={n.x + 8} y={n.y + 4} textAnchor="middle" className="a-text">
              {n.t}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  const steps = ['Crawl', 'Index', 'Retrieve', 'Answer'];
  return (
    <svg className="proj-art" viewBox="0 0 320 120" aria-hidden="true">
      {steps.map((s, i) => (
        <g key={s}>
          {i > 0 && <path d={`M${i * 76 - 4} 60 H${i * 76 + 12}`} className="a-wire" />}
          <rect x={i * 76 + 12} y="44" width="60" height="32" rx="16" className={i === 3 ? 'a-frame' : 'a-node'} />
          <text x={i * 76 + 42} y="64" textAnchor="middle" className={`a-text${i === 3 ? ' strong' : ''}`}>
            {s}
          </text>
        </g>
      ))}
    </svg>
  );
}

