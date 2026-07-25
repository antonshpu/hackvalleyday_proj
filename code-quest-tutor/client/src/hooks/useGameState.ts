import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterState, GameState, ProjectBreakdown } from '../types';
import { ensureSignedIn, loadProgress, saveProgress } from '../services/firebase';

const XP_PER_TASK = 50;
const XP_PER_LEVEL_BONUS = 100;

function freshState(): GameState {
  return {
    xp: 0,
    currentLevelIndex: 0,
    startedAt: Date.now(),
    elapsedSeconds: 0,
    achievements: [],
    characterState: 'IDLE',
  };
}

export function useGameState(breakdown: ProjectBreakdown | null) {
  const [state, setState] = useState<GameState>(freshState());
  const uidRef = useRef<string>('local-guest');

  // Timer tick
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => ({ ...s, elapsedSeconds: s.elapsedSeconds + 1 }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Load persisted progress once we know which project we're on
  useEffect(() => {
    if (!breakdown) return;
    (async () => {
      const uid = await ensureSignedIn();
      uidRef.current = uid;
      const saved = await loadProgress(uid);
      if (saved && saved.breakdown?.projectName === breakdown.projectName) {
        setState(saved.gameState);
      }
    })();
  }, [breakdown?.projectName]);

  // Autosave
  useEffect(() => {
    if (!breakdown) return;
    const id = setTimeout(() => {
      saveProgress(uidRef.current, { gameState: state, breakdown, savedAt: Date.now() });
    }, 800);
    return () => clearTimeout(id);
  }, [state, breakdown]);

  const setCharacterState = useCallback((cs: CharacterState) => {
    setState((s) => ({ ...s, characterState: cs }));
  }, []);

  const awardTaskXp = useCallback(() => {
    setState((s) => ({ ...s, xp: s.xp + XP_PER_TASK }));
  }, []);

  const advanceLevel = useCallback((achievementLabel?: string) => {
    setState((s) => ({
      ...s,
      xp: s.xp + XP_PER_LEVEL_BONUS,
      currentLevelIndex: s.currentLevelIndex + 1,
      achievements: achievementLabel ? [...s.achievements, achievementLabel] : s.achievements,
    }));
  }, []);

  const resetForNewProject = useCallback(() => {
    setState(freshState());
  }, []);

  return { state, setCharacterState, awardTaskXp, advanceLevel, resetForNewProject };
}
