import { useEffect, useState } from 'react';
import type { ProjectPlan } from './types';
import { HomeScreen } from './components/HomeScreen';
import { CodingEnvironment } from './components/CodingEnvironment';
import { ProjectsScreen } from './components/ProjectsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { mockBreakdownProject } from './data/mockGemini';
import { useGameState } from './hooks/useGameState';
import { useProfile } from './hooks/useProfile';
import { loadPlan, savePlan } from './lib/storage';

type Screen = 'home' | 'coding' | 'projects' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [plan, setPlan] = useState<ProjectPlan | null>(() => loadPlan());
  const [isLoading, setIsLoading] = useState(false);

  const profile = useProfile();
  const { state, resetProgress } = useGameState(plan);

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  async function handleStartQuest(prompt: string) {
    setIsLoading(true);
    const result = await mockBreakdownProject(prompt);
    resetProgress();
    setPlan(result);
    setIsLoading(false);
    setScreen('coding');
  }

  function handleResumeQuest() {
    if (plan) setScreen('coding');
  }

  function handleLevelContinue(isLastLevel: boolean) {
    if (isLastLevel) {
      setScreen('home');
    } else {
      setScreen('coding');
    }
  }

  function handleResetQuestProgress() {
    resetProgress();
    setPlan(null);
    setScreen('home');
  }

  const currentLevel = plan?.levels[state.currentLevelIndex];

  return (
    <div className="h-screen w-screen">
      {screen === 'home' && (
        <HomeScreen
          plan={plan}
          currentLevelIndex={state.currentLevelIndex}
          isLoading={isLoading}
          profile={profile}
          onStartQuest={handleStartQuest}
          onResume={handleResumeQuest}
          onNavigate={setScreen}
          activeNav="home"
        />
      )}

      {screen === 'coding' && plan && (
        <CodingEnvironment
          plan={plan}
          profile={profile}
          onLevelContinue={handleLevelContinue}
          onExitToHome={() => setScreen('home')}
        />
      )}

      {screen === 'projects' && (
        <ProjectsScreen plan={plan} onBack={() => setScreen('home')} />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          onBack={() => setScreen('home')}
          onResetProfile={() => {
            profile.resetProfile();
            handleResetQuestProgress();
          }}
        />
      )}
    </div>
  );
}
