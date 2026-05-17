import { ulid } from 'ulid';
import { firestore, paths } from './firebase';
import type { JournalEntry } from '@/types';

export const journalRepo = {
  subscribe(uid: string, cb: (entries: JournalEntry[]) => void): () => void {
    return firestore()
      .collection(paths.journal(uid))
      .orderBy('createdAt', 'desc')
      .limit(200)
      .onSnapshot(
        (snap) =>
          cb(
            snap.docs.map((d) => ({ ...(d.data() as JournalEntry), id: d.id })),
          ),
        (err) => {
          if (__DEV__) console.warn('[journalRepo.subscribe]', err);
          cb([]);
        },
      );
  },

  async create(
    uid: string,
    entry: Omit<JournalEntry, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    const id = ulid();
    const now = Date.now();
    await firestore()
      .doc(paths.journalEntry(uid, id))
      .set({
        ...entry,
        authorId: uid,
        createdAt: now,
        updatedAt: now,
      });
    return id;
  },

  async update(uid: string, id: string, patch: Partial<JournalEntry>): Promise<void> {
    await firestore()
      .doc(paths.journalEntry(uid, id))
      .set({ ...patch, updatedAt: Date.now() }, { merge: true });
  },

  async delete(uid: string, id: string): Promise<void> {
    await firestore().doc(paths.journalEntry(uid, id)).delete();
  },
};
