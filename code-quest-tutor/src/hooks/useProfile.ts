import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'toast-code:profile';
const XP_PER_LEVEL = 500;

interface StoredProfile {
  name: string;
  totalXp: number;
  streak: number;
  projectsCompleted: number;
  checkedDates: string[]; // ISO yyyy-mm-dd, days the player did at least one task
  lastActiveDate: string | null;
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

function defaultProfile(): StoredProfile {
  return {
    name: 'BreadDev',
    totalXp: 2450,
    streak: 0,
    projectsCompleted: 8,
    checkedDates: [],
    lastActiveDate: null,
  };
}

function loadProfile(): StoredProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    return { ...defaultProfile(), ...(JSON.parse(raw) as StoredProfile) };
  } catch {
    return defaultProfile();
  }
}

/** Monday-first weekly activity, e.g. [true, true, false, ...] for Mon..Sun */
function getWeekChecks(checkedDates: string[]): boolean[] {
  const now = new Date();
  const jsDay = now.getUTCDay(); // 0 = Sun
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = addDays(toISODate(now), mondayOffset);
  const set = new Set(checkedDates);
  return Array.from({ length: 7 }, (_, i) => set.has(addDays(monday, i)));
}

export function useProfile() {
  const [profile, setProfile] = useState<StoredProfile>(loadProfile);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const addXp = useCallback((amount: number) => {
    setProfile((p) => {
      const t = toISODate(new Date());
      const alreadyToday = p.checkedDates.includes(t);
      let streak = p.streak;
      if (!alreadyToday) {
        const yesterday = addDays(t, -1);
        streak = p.lastActiveDate === yesterday || p.lastActiveDate === null ? p.streak + 1 : 1;
      }
      return {
        ...p,
        totalXp: p.totalXp + amount,
        checkedDates: alreadyToday ? p.checkedDates : [...p.checkedDates, t],
        lastActiveDate: t,
        streak,
      };
    });
  }, []);

  const completeProject = useCallback(() => {
    setProfile((p) => ({ ...p, projectsCompleted: p.projectsCompleted + 1 }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile({
      name: 'BreadDev',
      totalXp: 0,
      streak: 0,
      projectsCompleted: 0,
      checkedDates: [],
      lastActiveDate: null,
    });
  }, []);

  const level = useMemo(() => 1 + Math.floor(profile.totalXp / XP_PER_LEVEL), [profile.totalXp]);
  const xpIntoLevel = profile.totalXp % XP_PER_LEVEL;
  const weekChecks = useMemo(() => getWeekChecks(profile.checkedDates), [profile.checkedDates]);
  const todayIndex = useMemo(() => {
    const jsDay = new Date().getUTCDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  return {
    name: profile.name,
    totalXp: profile.totalXp,
    streak: profile.streak,
    projectsCompleted: profile.projectsCompleted,
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    weekChecks,
    todayIndex,
    addXp,
    completeProject,
    resetProfile,
  };
}

export type ProfileApi = ReturnType<typeof useProfile>;
