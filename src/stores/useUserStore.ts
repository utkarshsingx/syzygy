import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv';

type UserState = {
  name: string;
  onboarded: boolean;
  themePreference: 'auto' | 'light' | 'dark';
  reducedMotionOverride: boolean | null;
  bloomQuality: 'high' | 'low' | 'auto';
  dailyReminderTime: string | null; // "HH:mm"
  setName: (name: string) => void;
  setOnboarded: (v: boolean) => void;
  setThemePreference: (t: UserState['themePreference']) => void;
  setReducedMotionOverride: (v: boolean | null) => void;
  setBloomQuality: (q: UserState['bloomQuality']) => void;
  setDailyReminderTime: (t: string | null) => void;
  reset: () => void;
};

const initial = {
  name: '',
  onboarded: false,
  themePreference: 'auto' as const,
  reducedMotionOverride: null,
  bloomQuality: 'auto' as const,
  dailyReminderTime: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initial,
      setName: (name) => set({ name }),
      setOnboarded: (onboarded) => set({ onboarded }),
      setThemePreference: (themePreference) => set({ themePreference }),
      setReducedMotionOverride: (reducedMotionOverride) => set({ reducedMotionOverride }),
      setBloomQuality: (bloomQuality) => set({ bloomQuality }),
      setDailyReminderTime: (dailyReminderTime) => set({ dailyReminderTime }),
      reset: () => set(initial),
    }),
    {
      name: 'bloom.user.v1',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
