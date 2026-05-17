import { firestore, paths } from './firebase';
import { generateInviteCode } from '@/lib/invite';
import type { CoupleDoc } from '@/types';

export const couplesRepo = {
  async getById(coupleId: string): Promise<CoupleDoc | null> {
    const snap = await firestore().doc(paths.couple(coupleId)).get();
    if (!snap.exists()) return null;
    return { ...(snap.data() as CoupleDoc), coupleId: snap.id };
  },

  async getByInviteCode(code: string): Promise<CoupleDoc | null> {
    const codeDoc = await firestore().doc(paths.inviteCode(code)).get();
    if (!codeDoc.exists()) return null;
    const { coupleId } = codeDoc.data() as { coupleId: string };
    return this.getById(coupleId);
  },

  subscribe(coupleId: string, cb: (couple: CoupleDoc | null) => void): () => void {
    return firestore()
      .doc(paths.couple(coupleId))
      .onSnapshot(
        (snap) =>
          cb(snap.exists() ? { ...(snap.data() as CoupleDoc), coupleId: snap.id } : null),
        (err) => {
          if (__DEV__) console.warn('[couplesRepo.subscribe]', err);
          cb(null);
        },
      );
  },

  // Creator-only: makes the couple doc + a reverse-lookup inviteCode doc.
  // Server-side validation in Cloud Functions (M6) enforces these invariants.
  async create(createdBy: string): Promise<{ coupleId: string; inviteCode: string }> {
    const coupleId = firestore().collection(paths.couples()).doc().id;
    const inviteCode = generateInviteCode();
    const now = Date.now();

    const batch = firestore().batch();
    batch.set(firestore().doc(paths.couple(coupleId)), {
      coupleId,
      inviteCode,
      members: [createdBy, null],
      status: 'pending',
      createdBy,
      createdAt: now,
      updatedAt: now,
    } satisfies CoupleDoc);

    batch.set(firestore().doc(paths.inviteCode(inviteCode)), {
      coupleId,
      createdBy,
      createdAt: now,
      expiresAt: now + 1000 * 60 * 60 * 24 * 14, // 14d
    });

    await batch.commit();
    return { coupleId, inviteCode };
  },
};
