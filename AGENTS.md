# Bloom — agent notes

## Expo SDK 54
Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code that touches Expo modules. APIs change frequently between SDK versions.

## Project conventions
- TypeScript strict; `@/*` alias maps to `src/*`
- Import order: external → `@/*` → relative; named imports preferred
- NativeWind for styling; never `StyleSheet.create` unless interop with non-className consumer (Skia, Reanimated worklets, animated styles)
- Tokens live in `src/theme/{colors,typography,spacing,motion}.ts` AND `tailwind.config.js` — keep both in sync
- Tailwind utility class > inline style. Use `cn()` from `@/lib/cn` for conditional classes
- One file = one concern; avoid 400-line components
- Pure functions in `src/lib/*` get Jest tests; everything else is exercised manually until M8 polish

## Architecture
- Firestore is source of truth; Zustand stores mirror snapshots
- MMKV only for UI state (onboarded flag, theme prefs, bloom quality)
- AuthProvider in `src/auth/AuthProvider.tsx` owns the repo subscription lifecycle — don't subscribe outside it
- All Skia drawing happens inside Reanimated worklets; share values flow through `useSharedValue` → `useDerivedValue`
- Reduced motion: ALWAYS check `useReducedMotion()` before adding springs/particles/loops

## Workflow
- `npm test` before each commit (predictions has 13 tests)
- `npx tsc --noEmit` before each commit
- `npx expo-doctor` before each PR to catch peer-dep drift
- For Metro sanity: `node_modules/.bin/expo export --platform android --output-dir /tmp/x` (~30s) — full Hermes bundle catches everything
- Don't add a dependency without checking Expo SDK 54 compatibility — use `npx expo install` not `npm install` for native modules
- Native Firebase requires a custom dev client; Expo Go won't work. Always test on a real Android device after EAS dev build.

## Pitfalls to avoid
- `react-native-mmkv` v4 uses `createMMKV()`, not `new MMKV()`. The type-only `MMKV` import is for typing only.
- `react-native-reanimated` 4 requires `react-native-worklets` peer dep
- Moti pulls a transitive `react@19.2`; we override to `19.1.0` in `package.json` `overrides` to keep dedup'd
- `functions/` has its own tsconfig + node_modules; the root tsconfig excludes it
- The web app at `/Users/utkarshsingh/Desktop/Periods` is empty on this machine — don't reference it; the data types + predictions are written from scratch in this repo
