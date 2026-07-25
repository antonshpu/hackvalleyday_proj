import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import MainEnvironment from './components/MainEnvironment';
import { fetchProjectBreakdown } from './services/api';
import { useGameState } from './hooks/useGameState';
import type { ProjectBreakdown } from './types';

type Screen = 'setup' | 'loading' | 'playing';

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [prompt, setPrompt] = useState('');
  const [breakdown, setBreakdown] = useState<ProjectBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { state, setCharacterState, awardTaskXp, advanceLevel, resetForNewProject } = useGameState(breakdown);

  async function handleSubmitPrompt(value: string) {
    setPrompt(value);
    setScreen('loading');
    setError(null);
    try {
      const result = await fetchProjectBreakdown(value);
      resetForNewProject();
      setBreakdown(result);
      setScreen('playing');
    } catch (err) {
      console.error(err);
      setError('Something went wrong building your project. Please try again.');
      setScreen('setup');
    }
  }

  if (screen === 'setup') {
    return (
      <>
        <LandingPage onSubmit={handleSubmitPrompt} />
        {error && (
          <div
            role="alert"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-danger/15 border border-danger text-danger font-mono text-sm px-4 py-2 rounded-sm"
          >
            {error}
          </div>
        )}
      </>
    );
  }

  if (screen === 'loading') {
    return <LoadingScreen projectName={prompt} />;
  }

  if (screen === 'playing' && breakdown) {
    return (
      <MainEnvironment
        breakdown={breakdown}
        setBreakdown={setBreakdown}
        gameState={state}
        setCharacterState={setCharacterState}
        awardTaskXp={awardTaskXp}
        advanceLevel={advanceLevel}
      />
    );
  }

  return null;
}
