import type { ProjectPlan } from '../types';

const PLAN_KEY = 'toast-code:plan';

export function loadPlan(): ProjectPlan | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProjectPlan;
  } catch {
    return null;
  }
}

export function savePlan(plan: ProjectPlan | null) {
  try {
    if (!plan) {
      localStorage.removeItem(PLAN_KEY);
    } else {
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    }
  } catch {
    // ignore quota errors
  }
}
