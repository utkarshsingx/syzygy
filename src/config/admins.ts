// Bootstrap admin allowlist. The first developer gets in via this list before
// any Firestore user doc carries `isAdmin: true`. Once a UID is granted via the
// user doc, you can remove it from here.
//
// To find your UID: open the app, sign in, and copy `auth().currentUser?.uid`.
export const HARDCODED_ADMIN_UIDS: readonly string[] = [
  // 'paste-your-firebase-uid-here',
];
