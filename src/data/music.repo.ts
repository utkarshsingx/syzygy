import { ulid } from 'ulid';
import { firestore, paths } from './firebase';
import type { Track } from '@/types/music';

export const musicRepo = {
  async list(): Promise<Track[]> {
    const snap = await firestore()
      .collection(paths.music())
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => d.data() as Track);
  },

  subscribe(cb: (tracks: Track[]) => void): () => void {
    return firestore()
      .collection(paths.music())
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snap) => cb(snap.docs.map((d) => d.data() as Track)),
        (err) => {
          if (__DEV__) console.warn('[musicRepo.subscribe]', err);
          cb([]);
        },
      );
  },

  async create(input: Omit<Track, 'id' | 'createdAt'>): Promise<Track> {
    const id = ulid();
    const track: Track = { ...input, id, createdAt: Date.now() };
    await firestore().doc(paths.musicTrack(id)).set(track);
    return track;
  },

  async delete(id: string): Promise<void> {
    await firestore().doc(paths.musicTrack(id)).delete();
  },
};
