// Mirror of tailwind.config.js so Skia worklets, Reanimated, and any non-className
// code path can import hex values directly (Tailwind classes are not visible in worklets).
export const colors = {
  terracotta: '#C8704D',
  roseDust: '#D9A6A0',
  ochre: '#C99A4A',
  sage: '#9CAE8E',
  cream: '#F5EFE4',
  paper: '#EAE0CE',
  ink: '#2A2622',
} as const;

export type ColorToken = keyof typeof colors;

// Phase-specific accent colors used by bloom + phase rings + calendar cells.
export const phaseColors = {
  menstrual: colors.terracotta,
  follicular: colors.roseDust,
  ovulation: colors.ochre,
  luteal: colors.sage,
} as const;
