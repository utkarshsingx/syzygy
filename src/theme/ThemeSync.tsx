import { useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { usePhase } from '@/hooks/usePhase';

// Bridges live phase predictions into the ThemeProvider. Mount once at app
// root so PhasedStatusBar + any other phase-tinted chrome track real data.
export function ThemeSync() {
  const { setPhase, phase: current } = useTheme();
  const summary = usePhase();
  useEffect(() => {
    if (summary && summary.phase !== current) {
      setPhase(summary.phase);
    }
  }, [summary?.phase, current, setPhase]);
  return null;
}
