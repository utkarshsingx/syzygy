import * as Notifications from 'expo-notifications';

// Tell expo-notifications how to surface FCM/local payloads when the app
// is in the foreground (banner + sound, no badge).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export {};
