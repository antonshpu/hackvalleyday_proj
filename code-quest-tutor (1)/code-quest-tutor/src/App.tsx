import { useState } from 'react';
import type { ProjectPlan } from './types';
import { LandingScreen } from './components/LandingScreen';
import { CodingEnvironment } from './components/CodingEnvironment';
import { mockBreakdownProject } from './data/mockGemini';

export default function App() {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(prompt: string) {
    setIsLoading(true);
    const result = await mockBreakdownProject(prompt);
    setPlan(result);
    setIsLoading(false);
  }

  return (
    <div className="h-screen w-screen">
      {plan ? (
        <CodingEnvironment plan={plan} />
      ) : (
        <LandingScreen onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}
