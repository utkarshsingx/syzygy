import { create } from 'zustand';
import type { CycleEntry, UserPeriodData } from '@/types';

type CycleState = {
  uid: string | null;
  entries: CycleEntry[]; // newest-first (mirrors repo subscribe order)
  periodData: UserPeriodData | null;
  loading: boolean;
  setUid: (uid: string | null) => void;
  setEntries: (entries: CycleEntry[]) => void;
  setPeriodData: (data: UserPeriodData | null) => void;
  setLoading: (loading: boolean) => void;
};

// Firestore is source of truth. This store mirrors the latest snapshot so
// React can render synchronously. AuthProvider wires the repo subscriptions
// and pumps results into here (M3.5).
export const useCycleStore = create<CycleState>((set) => ({
  uid: null,
  entries: [],
  periodData: null,
  loading: false,
  setUid: (uid) => set({ uid }),
  setEntries: (entries) => set({ entries }),
  setPeriodData: (periodData) => set({ periodData }),
  setLoading: (loading) => set({ loading }),
}));

// Derive UserPeriodData from raw CycleEntry list — finds period starts and
// computes rolling averages without needing a separate Firestore document.
export function derivePeriodData(uid: string, entries: CycleEntry[]): UserPeriodData {
  const starts = entries
    .filter((e) => e.isPeriodStart)
    .map((e) => e.dateISO)
    .sort();
  const lastPeriodStart = starts.at(-1);
  const cycleLengths: number[] = [];
  for (let i = 1; i < starts.length; i++) {
    const a = new Date(starts[i - 1]!);
    const b = new Date(starts[i]!);
    const d = Math.round((+b - +a) / 86_400_000);
    if (d > 18 && d < 60) cycleLengths.push(d);
  }
  const recent = cycleLengths.slice(-6);
  const cycleLengthAvg = recent.length
    ? Math.round(recent.reduce((s, v) => s + v, 0) / recent.length)
    : 28;

  return {
    userId: uid,
    cycleLengthAvg,
    periodLengthAvg: 5,
    lastPeriodStart,
    history: starts,
    updatedAt: Date.now(),
  };
}
