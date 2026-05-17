import { Easing } from 'react-native-reanimated';

// Spring presets tuned to match the web app's framer-motion feel.
export const springs = {
  // Button press scale, modal pop, quick UI bounces.
  press: { mass: 0.6, damping: 16, stiffness: 320 },
  // Phase ring fill, card reveal, gentle morph.
  soft: { mass: 1, damping: 18, stiffness: 140 },
  // Bloom petal openness/wilt/glow morph — the signature feel.
  bloom: { mass: 1.2, damping: 14, stiffness: 90 },
} as const;

// Timing curves (mirrors web's ease-out-soft).
export const easings = {
  outSoft: Easing.bezier(0.16, 1, 0.3, 1),
  inOutSoft: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const durations = {
  fast: 200,
  base: 320,
  slow: 600,
  reveal: 800,
} as const;
