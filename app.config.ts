import type { ExpoConfig, ConfigContext } from 'expo/config';

const PACKAGE_NAME = 'com.bloom.app';
const BUNDLE_ID = 'com.bloom.app';
const SCHEME = 'bloom';
const DEEP_LINK_HOST = 'bloom.app';

// google-services.json is gitignored; provide via EAS secret file at build time.
// Path resolution: relative to project root. Set GOOGLE_SERVICES_FILE in env to override.
const GOOGLE_SERVICES = process.env.GOOGLE_SERVICES_FILE ?? './google-services.json';
const GOOGLE_SERVICES_PLIST =
  process.env.GOOGLE_SERVICES_PLIST ?? './GoogleService-Info.plist';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Bloom',
  slug: 'bloom-app',
  scheme: SCHEME,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  backgroundColor: '#F5EFE4',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F5EFE4',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: BUNDLE_ID,
    supportsTablet: true,
    googleServicesFile: GOOGLE_SERVICES_PLIST,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: PACKAGE_NAME,
    versionCode: 1,
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    googleServicesFile: GOOGLE_SERVICES,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F5EFE4',
    },
    permissions: ['NOTIFICATIONS', 'RECORD_AUDIO', 'POST_NOTIFICATIONS'],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [{ scheme: 'https', host: DEEP_LINK_HOST, pathPrefix: '/share' }],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        action: 'VIEW',
        data: [{ scheme: SCHEME }],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/messaging',
    '@react-native-community/datetimepicker',
    [
      'expo-build-properties',
      {
        ios: { useFrameworks: 'static' },
        android: { compileSdkVersion: 35, targetSdkVersion: 35 },
      },
    ],
    ['expo-font', { fonts: [] }],
    'expo-splash-screen',
    'expo-notifications',
    [
      'expo-av',
      {
        microphonePermission: 'Allow Bloom to record voice journal entries.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? undefined,
    },
  },
  experiments: {
    typedRoutes: false,
  },
});
