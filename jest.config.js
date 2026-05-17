/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Augment (don't replace) jest-expo's transformIgnorePatterns so we still
  // transform our extra native module packages.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|@shopify/react-native-skia|moti|nativewind|react-native-css-interop|@gorhom))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.expo/'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
};
