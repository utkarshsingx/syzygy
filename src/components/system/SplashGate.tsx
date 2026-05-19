import { useEffect, useState, type ReactNode } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {
  // No-op: hideAsync may have been called already during fast refresh.
});

type Props = { children: ReactNode };

export function SplashGate({ children }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!hidden) {
      SplashScreen.hideAsync().finally(() => setHidden(true));
    }
  }, [hidden]);

  return <>{children}</>;
}
