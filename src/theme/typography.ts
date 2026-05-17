// Font family names match what expo-font loads in App.tsx.
// Variable-axis interpolation is unreliable on Android RN, so we ship static weights.
export const fonts = {
  display: 'Fraunces_400Regular',
  displayMedium: 'Fraunces_500Medium',
  displayBold: 'Fraunces_700Bold',
  body: 'InterTight_400Regular',
  bodyMedium: 'InterTight_500Medium',
  bodySemibold: 'InterTight_600SemiBold',
  bodyBold: 'InterTight_700Bold',
} as const;
