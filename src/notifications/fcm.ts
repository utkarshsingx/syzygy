import * as Notifications from 'expo-notifications';
import { messaging } from '@/data/firebase';
import { usersRepo } from '@/data/users.repo';

let unsubscribeForeground: (() => void) | null = null;

// Called on successful sign-in. Requests notification permission (idempotent),
// registers an FCM token, and saves it to the user document so Cloud Functions
// can fan out partner pushes.
export async function registerForRemoteMessages(uid: string): Promise<void> {
  try {
    // expo-notifications handles the runtime permission prompt on Android 13+.
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      if (req.status !== 'granted') return;
    }

    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    if (token) {
      await usersRepo.appendFcmToken(uid, token);
    }

    // Forward foreground FCM payloads to expo-notifications so users see them
    // even when the app is active (otherwise Android suppresses by default).
    unsubscribeForeground?.();
    unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification ?? {};
      if (title || body) {
        await Notifications.scheduleNotificationAsync({
          content: { title: title ?? 'Bloom', body: body ?? '' },
          trigger: null,
        });
      }
    });

    // Refresh stored token if Firebase rotates it.
    messaging().onTokenRefresh(async (next) => {
      await usersRepo.appendFcmToken(uid, next);
    });
  } catch (e) {
    if (__DEV__) console.warn('[fcm] registerForRemoteMessages failed', e);
  }
}

export function teardownRemoteMessages(): void {
  unsubscribeForeground?.();
  unsubscribeForeground = null;
}
