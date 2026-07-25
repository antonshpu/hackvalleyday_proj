import { useState } from 'react';
import type { ProjectPlan } from '../types';
import type { ProfileApi } from '../hooks/useProfile';
import { CharacterSprite } from './CharacterSprite';

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

const DEFAULT_PROMPT = 'e.g. I want to code Flappy Birds!';

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

export function HomeScreen({
  isLoading,
  profile,
  onStartQuest,
  onNavigate,
  activeNav,
}: Props) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);

  function handleStartQuest() {
    if (isLoading) return;
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onStartQuest(trimmed);
  }

  return (
    <div
      className="h-full w-full flex flex-col overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/home-bg.png')" }}
    >
      {/* top nav */}
      <header className="shrink-0 h-16 flex items-center justify-between px-6 border-b-2 border-ink-600 bg-ink-800/60">
        <div className="flex items-center shrink-0">
          <img
            src="/toast-code-logo.png"
            alt="Toast Code"
            className="h-10 w-auto object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
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

      {/* Center — title + quest textbox only */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-4 pb-16">
        <div className="flex flex-col items-center gap-8 -mt-8 sm:-mt-14 origin-center scale-110 sm:scale-125">
          <img
            src="/toast-code-logo.png"
            alt="Toast Code"
            className="h-24 md:h-36 w-auto object-contain drop-shadow-[3px_3px_0_rgba(0,0,0,0.35)]"
            style={{ imageRendering: 'pixelated' }}
          />

          <div className="relative w-full max-w-[42rem] flex flex-col items-center -mt-16 sm:-mt-20">
            <div className="relative w-full">
              <img
                src="/quest-textbox.png"
                alt=""
                aria-hidden
                className="w-full h-auto select-none pointer-events-none drop-shadow-[4px_6px_0_rgba(0,0,0,0.25)]"
                style={{ imageRendering: 'pixelated' }}
              />
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center pb-[18%]">
                  <p className="font-pixel text-[10px] text-black animate-pulse">
                    Conjuring your quest map…
                  </p>
                </div>
              ) : (
                <div className="absolute left-[18%] right-[8%] top-[30%] bottom-[26%] flex flex-col gap-0.5">
                  <p className="font-pixel text-[11px] sm:text-xs leading-relaxed text-black pointer-events-none select-none shrink-0 pl-3">
                    What do you want to code today?
                  </p>
                  <label htmlFor="quest-prompt" className="sr-only">
                    Quest prompt
                  </label>
                  <input
                    id="quest-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={(e) => {
                      if (prompt === DEFAULT_PROMPT) e.target.select();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleStartQuest();
                      }
                    }}
                    className="w-full flex-1 min-h-0 -mt-0.5 bg-transparent border-0 outline-none font-pixel text-[9px] sm:text-[10px] leading-snug text-black placeholder:text-black/50"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleStartQuest}
              disabled={isLoading || !prompt.trim()}
              className="relative z-10 -mt-[4.5rem] sm:-mt-[5.5rem] font-pixel text-[12px] sm:text-sm tracking-wide text-parchment-100 bg-[#4a2a14] hover:bg-[#5c361c] disabled:opacity-50 border-4 border-[#2a1810] px-10 py-3.5 sm:px-12 sm:py-4 rounded-md shadow-[3px_3px_0_#1a0e08] transition-colors retro-focus"
            >
              START QUEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
