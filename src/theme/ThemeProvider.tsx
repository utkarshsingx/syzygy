import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { colors, phaseColors } from './colors';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Phase is set by M3's usePhase() hook once cycle data exists.
// For M2 the default is 'follicular' so previews and the gallery render with a value.
type Phase = keyof typeof phaseColors;

type ThemeContextValue = {
  phase: Phase;
  accent: string;
  base: typeof colors;
  reducedMotion: boolean;
  setPhase: (p: Phase) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

type Props = {
  children: ReactNode;
  initialPhase?: Phase;
};

import { useState } from 'react';

export function ThemeProvider({ children, initialPhase = 'follicular' }: Props) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const reducedMotion = useReducedMotion();

  const value = useMemo<ThemeContextValue>(
    () => ({
      phase,
      accent: phaseColors[phase],
      base: colors,
      reducedMotion,
      setPhase,
    }),
    [phase, reducedMotion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
