import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { usersRepo } from '@/data/users.repo';
import { HARDCODED_ADMIN_UIDS } from '@/config/admins';

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  const [docIsAdmin, setDocIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setDocIsAdmin(false);
      return;
    }
    const unsub = usersRepo.subscribe(user.uid, (profile) => {
      setDocIsAdmin(profile?.isAdmin === true);
    });
    return unsub;
  }, [user]);

  if (!user) return false;
  if (HARDCODED_ADMIN_UIDS.includes(user.uid)) return true;
  return docIsAdmin;
}
