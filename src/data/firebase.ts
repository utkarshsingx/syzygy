import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

let initialized = false;

// Idempotent — safe to call from multiple places at boot.
// google-services.json (Android) / GoogleService-Info.plist (iOS) provide the
// actual app credentials at native-build time; nothing to configure here.
export function initFirebase(): void {
  if (initialized) return;

  // Configure Firestore persistence + unlimited cache size for offline-first UX.
  firestore().settings({
    persistence: true,
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  });

  initialized = true;
}

export { firebase, auth, firestore, messaging };

// Collection / path helpers — single source of truth for Firestore paths.
export const paths = {
  user: (uid: string) => `users/${uid}`,
  cycleEntries: (uid: string) => `users/${uid}/cycleEntries`,
  cycleEntry: (uid: string, date: string) => `users/${uid}/cycleEntries/${date}`,
  journal: (uid: string) => `users/${uid}/journal`,
  journalEntry: (uid: string, id: string) => `users/${uid}/journal/${id}`,
  couples: () => `couples`,
  couple: (coupleId: string) => `couples/${coupleId}`,
  messages: (coupleId: string) => `couples/${coupleId}/messages`,
  message: (coupleId: string, id: string) => `couples/${coupleId}/messages/${id}`,
  inviteCodes: () => `inviteCodes`,
  inviteCode: (code: string) => `inviteCodes/${code}`,
  music: () => `music`,
  musicTrack: (id: string) => `music/${id}`,
};
