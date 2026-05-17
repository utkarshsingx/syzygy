import { firestore, paths } from './firebase';
import type { UserProfile } from '@/types';

export const usersRepo = {
  async get(uid: string): Promise<UserProfile | null> {
    const snap = await firestore().doc(paths.user(uid)).get();
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  },

  subscribe(uid: string, cb: (profile: UserProfile | null) => void): () => void {
    return firestore()
      .doc(paths.user(uid))
      .onSnapshot(
        (snap) => cb(snap.exists() ? (snap.data() as UserProfile) : null),
        (err) => {
          if (__DEV__) console.warn('[usersRepo.subscribe]', err);
          cb(null);
        },
      );
  },

  async upsert(profile: UserProfile): Promise<void> {
    await firestore()
      .doc(paths.user(profile.uid))
      .set({ ...profile, updatedAt: Date.now() }, { merge: true });
  },

  async appendFcmToken(uid: string, token: string): Promise<void> {
    await firestore()
      .doc(paths.user(uid))
      .set(
        { fcmTokens: firestore.FieldValue.arrayUnion(token), updatedAt: Date.now() },
        { merge: true },
      );
  },
};
