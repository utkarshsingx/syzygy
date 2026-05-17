import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { schedulePeriodPredictionReminder } from './scheduler';
import { useCycleStore, derivePeriodData } from '@/stores/useCycleStore';
import { predict } from '@/lib/predictions';

const TASK = 'BLOOM_DAILY_PREDICTION';

// Recomputes the prediction from the in-cache cycle entries and re-schedules
// the "period in 2 days" local notification. Cheap — no network. Android may
// throttle aggressively; foreground also runs this via usePhase().
TaskManager.defineTask(TASK, async () => {
  try {
    const { uid, entries } = useCycleStore.getState();
    if (!uid) return BackgroundFetch.BackgroundFetchResult.NoData;
    const periodData = derivePeriodData(uid, entries);
    const summary = predict(periodData);
    await schedulePeriodPredictionReminder(summary);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    if (__DEV__) console.warn('[backgroundFetch]', e);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Idempotent — safe to call multiple times.
export async function registerBackgroundFetch(): Promise<void> {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) {
      return;
    }
    await BackgroundFetch.registerTaskAsync(TASK, {
      minimumInterval: 60 * 60 * 12, // 12h target — Android may run less often
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (e) {
    if (__DEV__) console.warn('[backgroundFetch register]', e);
  }
}
