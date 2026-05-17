import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Recursive cascade for account deletion. Play Store requires that in-app
// account deletion removes all user data. Couples become orphans (the
// remaining member sees an unlinked state) but aren't deleted — partner
// keeps their own copy of message history.
export const deleteUserData = onCall({ region: 'us-central1' }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in first.');

  const db = getFirestore();

  // Subcollections under /users/{uid} are deleted recursively via the admin
  // SDK helper available on the Firestore reference (`recursiveDelete`).
  await db.recursiveDelete(db.doc(`users/${uid}`));

  // If the user was in a couple, mark them as removed from the membership
  // so the surviving partner sees a graceful unlink.
  const userDoc = await db.doc(`users/${uid}`).get(); // already deleted, may not exist
  const partnerCoupleId = (userDoc.data() as { partnerCoupleId?: string } | undefined)
    ?.partnerCoupleId;
  if (partnerCoupleId) {
    const coupleRef = db.doc(`couples/${partnerCoupleId}`);
    const couple = await coupleRef.get();
    if (couple.exists) {
      const data = couple.data() as { members: [string, string | null] };
      const remaining = data.members.find((m) => m && m !== uid) ?? null;
      await coupleRef.set(
        {
          members: [remaining, null],
          status: 'pending',
          updatedAt: Date.now(),
        },
        { merge: true },
      );
    }
  }

  // Finally, delete the auth user.
  await getAuth().deleteUser(uid);

  return { ok: true };
});
