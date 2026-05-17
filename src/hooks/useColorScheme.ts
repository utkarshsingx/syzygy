import { useColorScheme as useRNColorScheme } from 'react-native';
import { useUserStore } from '@/stores/useUserStore';

export function useColorScheme(): 'light' | 'dark' {
  const preference = useUserStore((s) => s.themePreference);
  const system = useRNColorScheme();
  if (preference === 'light' || preference === 'dark') return preference;
  return system === 'dark' ? 'dark' : 'light';
}
