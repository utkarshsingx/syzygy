import * as Notifications from 'expo-notifications';
import { addDays, parseISO, set } from 'date-fns';
import type { PhaseSummary } from '@/types';

const PREDICTED_PERIOD_ID = 'bloom-predicted-period';
const DAILY_REMINDER_ID = 'bloom-daily-reminder';

// Schedule a soft heads-up two days before the predicted period start.
// Cancels + reschedules whenever the prediction changes (idempotent).
export async function schedulePeriodPredictionReminder(
  summary: PhaseSummary | null,
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(PREDICTED_PERIOD_ID).catch(() => {});
  if (!summary) return;
  const triggerDate = addDays(parseISO(summary.nextPeriodStart), -2);
  if (triggerDate.getTime() <= Date.now()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: PREDICTED_PERIOD_ID,
    content: {
      title: 'A heads-up from Bloom',
      body: 'Your period is predicted in about two days — be gentle with yourself.',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });
}

// Schedule a daily nudge to log how you're feeling at the user-chosen time.
// `time` is "HH:mm"; null clears the reminder.
export async function scheduleDailyLogReminder(time: string | null): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
  if (!time) return;
  const parts = time.split(':');
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return;

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'A small check-in',
      body: 'How was today? Log a few words.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

// Best-effort: returns the next firing time of the prediction reminder, or null.
export async function debugListScheduled(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}
