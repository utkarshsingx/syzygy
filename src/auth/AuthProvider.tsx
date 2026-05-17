import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { auth, initFirebase } from '@/data/firebase';
import { cyclesRepo } from '@/data/cycles.repo';
import { journalRepo } from '@/data/journal.repo';
import { usersRepo } from '@/data/users.repo';
import { couplesRepo } from '@/data/couples.repo';
import { messagesRepo } from '@/data/messages.repo';
import { useCycleStore, derivePeriodData } from '@/stores/useCycleStore';
import { useJournalStore } from '@/stores/useJournalStore';
import { usePartnerStore } from '@/stores/usePartnerStore';
import { useUserStore } from '@/stores/useUserStore';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

type AuthStatus = 'booting' | 'anonymous' | 'authenticated' | 'signedOut' | 'error';

type AuthContextValue = {
  status: AuthStatus;
  user: FirebaseAuthTypes.User | null;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  upgradeAnonWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

type Props = { children: ReactNode };

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('booting');
  const [error, setError] = useState<string | null>(null);

  const unsubsRef = useRef<Array<() => void>>([]);

  // Init Firebase + subscribe to auth state once.
  useEffect(() => {
    try {
      initFirebase();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
      return;
    }

    const unsub = auth().onAuthStateChanged(async (next) => {
      setUser(next);
      if (!next) {
        // No user — start anonymous so the app is immediately usable.
        try {
          await auth().signInAnonymously();
          // onAuthStateChanged will fire again with the anon user.
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e));
          setStatus('error');
        }
        return;
      }
      setStatus(next.isAnonymous ? 'anonymous' : 'authenticated');
    });

    return () => {
      unsub();
      tearDownSubs();
    };
  }, []);

  // Wire repo subscriptions whenever the active uid changes.
  useEffect(() => {
    tearDownSubs();
    if (!user) return;

    const uid = user.uid;
    useCycleStore.getState().setUid(uid);
    useCycleStore.getState().setLoading(true);
    useJournalStore.getState().setLoading(true);

    // Bootstrap or update user doc.
    usersRepo
      .upsert({
        uid,
        displayName: user.displayName ?? useUserStore.getState().name ?? 'Friend',
        email: user.email ?? null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .catch((e) => {
        if (__DEV__) console.warn('[AuthProvider] usersRepo.upsert', e);
      });

    unsubsRef.current.push(
      cyclesRepo.subscribe(uid, (entries) => {
        useCycleStore.getState().setEntries(entries);
        useCycleStore.getState().setPeriodData(derivePeriodData(uid, entries));
        useCycleStore.getState().setLoading(false);
      }),
      journalRepo.subscribe(uid, (entries) => {
        useJournalStore.getState().setEntries(entries);
        useJournalStore.getState().setLoading(false);
      }),
      usersRepo.subscribe(uid, (profile) => {
        const coupleId = profile?.partnerCoupleId;
        if (!coupleId) {
          usePartnerStore.getState().setCouple(null);
          usePartnerStore.getState().setMessages([]);
          return;
        }
        unsubsRef.current.push(
          couplesRepo.subscribe(coupleId, (c) => usePartnerStore.getState().setCouple(c)),
          messagesRepo.subscribe(coupleId, (m) => usePartnerStore.getState().setMessages(m)),
        );
      }),
    );

    return tearDownSubs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  function tearDownSubs() {
    while (unsubsRef.current.length) {
      const u = unsubsRef.current.pop();
      try {
        u?.();
      } catch {
        /* noop */
      }
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      async signInWithEmail(email, password) {
        await auth().signInWithEmailAndPassword(email, password);
      },
      async signUpWithEmail(email, password, displayName) {
        const cred = await auth().createUserWithEmailAndPassword(email, password);
        if (displayName) {
          await cred.user.updateProfile({ displayName });
        }
      },
      async upgradeAnonWithEmail(email, password, displayName) {
        const current = auth().currentUser;
        if (!current?.isAnonymous) {
          throw new Error('No anonymous session to upgrade.');
        }
        const credential = auth.EmailAuthProvider.credential(email, password);
        const result = await current.linkWithCredential(credential);
        if (displayName) {
          await result.user.updateProfile({ displayName });
        }
      },
      async signOut() {
        await auth().signOut();
        // onAuthStateChanged will fire with null, then immediately re-anon.
      },
      async deleteAccount() {
        // Full server-side cascade lands in M6's Cloud Function.
        // For now: delete the local auth user; repo data remains until the
        // function is wired (security rules deny orphan reads).
        await auth().currentUser?.delete();
        useUserStore.getState().reset();
      },
    }),
    [status, user, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
