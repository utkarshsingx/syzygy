import { firestore, paths } from './firebase';
import type { CycleEntry } from '@/types';

export const cyclesRepo = {
  subscribe(
    uid: string,
    cb: (entries: CycleEntry[]) => void,
    opts: { fromISO?: string; toISO?: string; limit?: number } = {},
  ): () => void {
    let q: FirebaseFirestoreTypes.Query = firestore().collection(paths.cycleEntries(uid));
    if (opts.fromISO) q = q.where('dateISO', '>=', opts.fromISO);
    if (opts.toISO) q = q.where('dateISO', '<=', opts.toISO);
    q = q.orderBy('dateISO', 'desc');
    if (opts.limit) q = q.limit(opts.limit);

    return q.onSnapshot(
      (snap) =>
        cb(
          snap.docs.map((d) => ({ ...(d.data() as CycleEntry), id: d.id })),
        ),
      (err) => {
        if (__DEV__) console.warn('[cyclesRepo.subscribe]', err);
        cb([]);
      },
    );
  },

  // Upsert by date so offline writes for the same day merge cleanly.
  async upsert(uid: string, entry: Omit<CycleEntry, 'createdAt' | 'updatedAt' | 'userId'>): Promise<void> {
    const now = Date.now();
    await firestore()
      .doc(paths.cycleEntry(uid, entry.dateISO))
      .set(
        {
          ...entry,
          userId: uid,
          updatedAt: now,
          // createdAt set only if missing (merge:true preserves existing).
          createdAt: now,
        },
        { merge: true },
      );
  },

  async delete(uid: string, dateISO: string): Promise<void> {
    await firestore().doc(paths.cycleEntry(uid, dateISO)).delete();
  },

  async getOne(uid: string, dateISO: string): Promise<CycleEntry | null> {
    const snap = await firestore().doc(paths.cycleEntry(uid, dateISO)).get();
    if (!snap.exists()) return null;
    return { ...(snap.data() as CycleEntry), id: snap.id };
  },
};

// Re-imported here to avoid a separate import dance in this file.
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
