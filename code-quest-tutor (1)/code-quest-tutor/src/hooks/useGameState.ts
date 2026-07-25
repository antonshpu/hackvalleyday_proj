import { useCallback, useEffect, useState } from 'react';
import type { CharacterState, GameState, ProjectPlan } from '../types';

const STORAGE_KEY = 'code-quest-tutor:save';

function loadSaved(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

function freshState(): GameState {
  return {
    xp: 0,
    currentLevelIndex: 0,
    currentTaskIndex: 0,
    startedAt: Date.now(),
    characterState: 'IDLE',
    achievements: [],
  };
}

export function useGameState(plan: ProjectPlan | null) {
  const [state, setState] = useState<GameState>(() => loadSaved() ?? freshState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCharacterState = useCallback((characterState: CharacterState) => {
    setState((s) => ({ ...s, characterState }));
  }, []);

  const awardXpAndAdvance = useCallback(
    (xp: number, isLastTaskInLevel: boolean, isLastLevel: boolean) => {
      setState((s) => ({
        ...s,
        xp: s.xp + xp,
        currentTaskIndex: isLastTaskInLevel ? 0 : s.currentTaskIndex + 1,
        currentLevelIndex: isLastTaskInLevel ? s.currentLevelIndex + (isLastLevel ? 0 : 1) : s.currentLevelIndex,
        achievements:
          isLastTaskInLevel && !isLastLevel
            ? [...s.achievements, `Level ${s.currentLevelIndex + 1} complete`]
            : s.achievements,
      }));
    },
    []
  );

  const resetProgress = useCallback(() => {
    const fresh = freshState();
    setState(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  return { state, setCharacterState, awardXpAndAdvance, resetProgress };
}
