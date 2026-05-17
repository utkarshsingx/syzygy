import { useEffect, useMemo } from 'react';
import { useCycleStore } from '@/stores/useCycleStore';
import { predict } from '@/lib/predictions';
import { schedulePeriodPredictionReminder } from '@/notifications/scheduler';
import type { PhaseSummary } from '@/types';

// Computes the current PhaseSummary from the latest cycle data.
// Returns null when there's no period start recorded yet.
// Side effect: reschedules the "period in 2 days" notification whenever the
// predicted next-period date changes.
export function usePhase(now: Date = new Date()): PhaseSummary | null {
  const periodData = useCycleStore((s) => s.periodData);
  const summary = useMemo(
    () => predict(periodData ?? undefined, now),
    [periodData, now],
  );

  useEffect(() => {
    schedulePeriodPredictionReminder(summary).catch(() => {
      /* notifications optional — silent failure */
    });
  }, [summary?.nextPeriodStart]);

  return summary;
}
