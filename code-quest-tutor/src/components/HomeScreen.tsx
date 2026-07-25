import { useEffect, useState } from 'react';
import type { ProjectPlan } from '../types';
import type { ProfileApi } from '../hooks/useProfile';
import { CharacterSprite } from './CharacterSprite';
import { Scene } from './Scene';

interface Props {
  plan: ProjectPlan | null;
  currentLevelIndex: number;
  isLoading: boolean;
  profile: ProfileApi;
  onStartQuest: (prompt: string) => void;
  onResume: () => void;
  onNavigate: (screen: 'home' | 'projects' | 'settings') => void;
  activeNav: 'home' | 'projects' | 'settings';
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const TIPS = [
  'Use meaningful variable names to make your code easier to read!',
  'Small, frequent commits make it easy to undo mistakes.',
  'Read the error message closely — it usually tells you exactly what broke.',
  'Break big problems into the smallest possible steps before you code.',
];

function NavTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative font-pixel text-[10px] tracking-wider pb-1 transition-colors ${
        active ? 'text-gold-400' : 'text-parchment-300/60 hover:text-parchment-200'
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-gold-400 rounded-full" />
      )}
    </button>
  );
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-parchment-300/80">
        <span aria-hidden>{icon}</span> {label}
      </span>
      <span className="font-mono text-gold-300">{value}</span>
    </div>
  );
}

export function HomeScreen({
  plan,
  currentLevelIndex,
  isLoading,
  profile,
  onStartQuest,
  onResume,
  onNavigate,
  activeNav,
}: Props) {
  const [value, setValue] = useState('');
  const [demoState, setDemoState] = useState<'IDLE' | 'CASTING'>('IDLE');
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDemoState((s) => (s === 'IDLE' ? 'CASTING' : 'IDLE'));
    }, 4200);
    return () => clearInterval(id);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onStartQuest(value.trim());
    setValue('');
  }

  const currentLevel = plan?.levels[currentLevelIndex];
  const totalLevels = plan?.levels.length ?? 0;
  const progressPct = totalLevels ? ((currentLevelIndex + 1) / totalLevels) * 100 : 0;

  return (
    <div className="h-full w-full flex flex-col bg-ink-900 overflow-y-auto">
      {/* top nav */}
      <header className="shrink-0 h-16 flex items-center justify-between px-6 border-b-2 border-ink-600 bg-ink-800/60">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-2xl">🍞</span>
          <span className="font-pixel text-gold-400 text-sm tracking-wide">TOAST CODE</span>
        </div>
        <nav className="flex items-center gap-8">
          <NavTab label="🏠 HOME" active={activeNav === 'home'} onClick={() => onNavigate('home')} />
          <NavTab
            label="📁 PROJECTS"
            active={activeNav === 'projects'}
            onClick={() => onNavigate('projects')}
          />
          <NavTab
            label="⚙️ SETTINGS"
            active={activeNav === 'settings'}
            onClick={() => onNavigate('settings')}
          />
        </nav>
        <div className="flex items-center gap-2 bg-ink-900 border-2 border-gold-600/70 rounded-md px-2 py-1">
          <div className="w-9 h-9 rounded bg-ink-700 flex items-center justify-center overflow-hidden">
            <CharacterSprite state="IDLE" size={30} />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-parchment-100 font-medium">{profile.name}</div>
            <div className="text-[10px] text-gold-400 flex items-center gap-1">
              <span aria-hidden>⭐</span> Level {profile.level}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[220px_1fr_260px] gap-4 p-4 min-h-0">
        {/* LEFT column */}
        <div className="flex flex-col gap-4">
          <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-3">
            <span className="font-pixel text-[9px] text-gold-400 tracking-wider">👤 YOUR STATS</span>
            <div className="mt-3 space-y-2">
              <StatRow icon="⭐" label="XP" value={profile.totalXp.toLocaleString()} />
              <StatRow icon="🏅" label="Level" value={profile.level} />
              <StatRow icon="🔥" label="Streak" value={profile.streak} />
              <StatRow icon="🍞" label="Projects" value={profile.projectsCompleted} />
            </div>
          </div>

          <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-3">
            <span className="font-pixel text-[9px] text-parchment-300/70 tracking-wider">
              🎮 CURRENT QUEST
            </span>
            {plan && currentLevel ? (
              <button onClick={onResume} className="mt-2.5 block w-full text-left group">
                <p className="text-sm text-parchment-100 group-hover:text-gold-300 transition-colors truncate">
                  {plan.projectName}
                </p>
                <div className="mt-2 h-2.5 w-full bg-ink-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-mono text-parchment-300/60">
                  Level {currentLevelIndex + 1} of {totalLevels}
                </p>
              </button>
            ) : (
              <p className="mt-2.5 text-xs text-parchment-300/50">
                No quest yet — describe something below to begin.
              </p>
            )}
          </div>
        </div>

        {/* CENTER column */}
        <div className="flex flex-col min-h-0">
          <Scene height={320} className="mb-4">
            <div className="absolute inset-x-0 top-6 flex flex-col items-center text-center px-6">
              <p className="font-pixel text-[9px] text-arcane-300/90 tracking-widest mb-2 drop-shadow">
                A GUIDED QUEST FOR NEW CODERS
              </p>
              <h1 className="font-pixel text-parchment-50 text-2xl md:text-3xl drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]">
                TOAST CODE
              </h1>
            </div>
            <div className="absolute left-8 bottom-[12%] flex items-end gap-3">
              <CharacterSprite state={isLoading ? 'CASTING' : demoState} size={72} />
              <span className="text-3xl -mb-1" aria-hidden>
                🪧
              </span>
            </div>
            <div className="absolute right-10 bottom-[13%] flex items-end gap-3 text-3xl" aria-hidden>
              <span>🍞</span>
              <span>📦</span>
              <span>🍯</span>
            </div>
          </Scene>

          <div className="bg-ink-800/80 border-2 border-gold-600/60 rounded-lg p-5">
            <p className="text-center font-pixel text-parchment-100 text-xs mb-4 tracking-wide">
              WHAT DO YOU WANT TO CODE TODAY?
            </p>
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <p className="font-mono text-arcane-300 text-sm animate-pulse">
                  Conjuring your quest map…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g., Flappy Bird, To-Do App, Snake Game…"
                  className="w-full bg-parchment-100 border-2 border-ink-700 focus:border-gold-500 rounded-md px-4 py-3 text-ink-900 placeholder:text-ink-700/40 text-sm outline-none retro-focus"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="mt-3 w-full bg-ink-900 hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed text-parchment-100 font-pixel text-[11px] py-3.5 rounded-md shadow-pixel transition-colors retro-focus border-2 border-ink-600"
                >
                  START QUEST
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-3">
            <span className="font-pixel text-[9px] text-gold-400 tracking-wider">📅 DAILY BREAD</span>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={i}
                  className={`text-center text-[9px] font-mono rounded-sm py-1 ${
                    i === profile.todayIndex ? 'text-gold-400 font-bold' : 'text-parchment-300/50'
                  }`}
                >
                  {d}
                </div>
              ))}
              {profile.weekChecks.map((checked, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm flex items-center justify-center text-[10px] border ${
                    checked
                      ? 'bg-gold-500 border-gold-700 text-ink-950'
                      : i === profile.todayIndex
                      ? 'bg-ink-900 border-gold-500 text-gold-500'
                      : 'bg-ink-900 border-ink-600 text-transparent'
                  }`}
                >
                  {checked ? '✓' : ''}
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-parchment-300/70">Complete today's challenge!</p>
            <p className="mt-1 text-xs text-gold-300 flex items-center gap-1">
              <span aria-hidden>🍞</span> +150 XP
            </p>
          </div>

          <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-3">
            <span className="font-pixel text-[9px] text-gold-400 tracking-wider">⭐ FEATURED QUEST</span>
            <div className="mt-2.5 rounded-md overflow-hidden border border-ink-600 bg-[#0c1024] relative h-20">
              <span className="absolute top-2 left-3 text-[11px] text-parchment-100 font-medium">
                Space Invaders
              </span>
              <span className="absolute top-1.5 right-3 text-lg" aria-hidden>
                🌙
              </span>
              <div className="absolute bottom-2 inset-x-3 flex justify-between text-lg" aria-hidden>
                <span className="animate-floaty">👾</span>
                <span className="animate-floaty" style={{ animationDelay: '0.3s' }}>
                  👾
                </span>
                <span className="animate-floaty" style={{ animationDelay: '0.6s' }}>
                  👾
                </span>
                <span>🚀</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-parchment-300/70">Master loops and functions</p>
            <button
              onClick={() => onStartQuest('Space Invaders')}
              className="mt-2 w-full bg-gold-500 hover:bg-gold-400 text-ink-950 font-pixel text-[9px] py-2.5 rounded-md shadow-pixel transition-colors retro-focus"
            >
              PLAY NOW
            </button>
          </div>

          <div className="bg-ink-800 border-2 border-ink-600 rounded-md p-3">
            <span className="font-pixel text-[9px] text-parchment-300/70 tracking-wider">
              💡 TIPS &amp; TRICKS
            </span>
            <p className="mt-2.5 text-xs text-parchment-200 leading-relaxed min-h-[3.5rem]">
              {TIPS[tipIndex]}
            </p>
            <button
              onClick={() => setTipIndex((i) => (i + 1) % TIPS.length)}
              className="mt-1 text-[10px] font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1 ml-auto"
            >
              next tip <span aria-hidden>›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
