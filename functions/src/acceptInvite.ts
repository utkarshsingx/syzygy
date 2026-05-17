import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';

// Atomic invite-acceptance — replaces the client-side write so we can enforce
// invariants the security rules can't easily express (exactly-once, expiry).
// Call from app via: httpsCallable('acceptInvite')({ code })
export const acceptInvite = onCall({ region: 'us-central1' }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in first.');
  }
  const code = (request.data?.code as string | undefined)?.toUpperCase();
  if (!code || code.length !== 8) {
    throw new HttpsError('invalid-argument', 'Bad invite code.');
  }

  const db = getFirestore();
  const codeRef = db.doc(`inviteCodes/${code}`);
  const codeSnap = await codeRef.get();
  if (!codeSnap.exists) {
    throw new HttpsError('not-found', 'Invite not found.');
  }
  const codeData = codeSnap.data() as { coupleId: string; createdBy: string; expiresAt: number };
  if (codeData.expiresAt < Date.now()) {
    throw new HttpsError('failed-precondition', 'Invite expired.');
  }
  if (codeData.createdBy === uid) {
    throw new HttpsError('failed-precondition', 'You can’t accept your own invite.');
  }

  const coupleRef = db.doc(`couples/${codeData.coupleId}`);

  await db.runTransaction(async (tx) => {
    const c = await tx.get(coupleRef);
    if (!c.exists) throw new HttpsError('not-found', 'Couple missing.');
    const data = c.data() as { members: [string, string | null]; status: string };
    if (data.status === 'linked') {
      throw new HttpsError('failed-precondition', 'Already linked.');
    }
    tx.update(coupleRef, {
      members: [data.members[0], uid],
      status: 'linked',
      updatedAt: Date.now(),
    });
    tx.set(
      db.doc(`users/${uid}`),
      { partnerCoupleId: codeData.coupleId, updatedAt: Date.now() },
      { merge: true },
    );
    tx.set(
      db.doc(`users/${data.members[0]}`),
      { partnerCoupleId: codeData.coupleId, updatedAt: Date.now() },
      { merge: true },
    );
    // Invalidate the code so it can't be reused.
    tx.update(codeRef, { expiresAt: 0 });
  });

  // Drop a little welcome message so the chat thread isn't empty.
  await db
    .collection(`couples/${codeData.coupleId}/messages`)
    .add({
      threadId: codeData.coupleId,
      from: uid,
      to: codeData.createdBy,
      type: 'text',
      content: 'just linked 🌸',
      readAt: null,
      createdAt: Date.now(),
    });

  return { coupleId: codeData.coupleId };
});
