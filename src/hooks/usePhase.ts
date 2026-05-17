import { useMemo } from 'react';
import { useCycleStore } from '@/stores/useCycleStore';
import { predict } from '@/lib/predictions';
import type { PhaseSummary } from '@/types';

// Computes the current PhaseSummary from the latest cycle data.
// Returns null when there's no period start recorded yet.
export function usePhase(now: Date = new Date()): PhaseSummary | null {
  const periodData = useCycleStore((s) => s.periodData);
  return useMemo(() => predict(periodData ?? undefined, now), [periodData, now]);
}
