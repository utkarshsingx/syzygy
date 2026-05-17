import { useEffect, useState, type ReactNode } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts as useFraunces, Fraunces_400Regular, Fraunces_500Medium, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import {
  useFonts as useInterTight,
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_600SemiBold,
  InterTight_700Bold,
} from '@expo-google-fonts/inter-tight';

SplashScreen.preventAutoHideAsync().catch(() => {
  // No-op: hideAsync may have been called already during fast refresh.
});

type Props = { children: ReactNode };

// Holds the native splash until fonts + any other boot work resolve, then fades to the app.
// Auth/data hydration will be added here in M3.
export function SplashGate({ children }: Props) {
  const [hidden, setHidden] = useState(false);

  const [fraunces] = useFraunces({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_700Bold,
  });
  const [interTight] = useInterTight({
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
    InterTight_700Bold,
  });

  const ready = fraunces && interTight;

  useEffect(() => {
    if (ready && !hidden) {
      SplashScreen.hideAsync().finally(() => setHidden(true));
    }
  }, [ready, hidden]);

  if (!ready) return null;
  return <>{children}</>;
}
