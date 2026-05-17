import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useUserStore } from '@/stores/useUserStore';

// Returns true when the user has reduced motion enabled in either the OS
// accessibility settings or the app's explicit override.
// Components consult this to skip springs/particles/grain animation.
export function useReducedMotion(): boolean {
  const override = useUserStore((s) => s.reducedMotionOverride);
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setSystemReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) =>
      setSystemReduced(v),
    );
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  if (override !== null) return override;
  return systemReduced;
}
