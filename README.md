# Bloom

A botanical period & cycle tracker for Android (and later iOS), built as a React Native port of the Periods/Bloom web app.

## Stack

- **Expo SDK 54** (managed) + **React Native 0.81** + **React 19** + **TypeScript** strict
- **react-navigation v7** (native-stack + bottom-tabs)
- **NativeWind 4** (Tailwind 3.4) — botanical palette (terracotta / roseDust / ochre / sage / cream / paper / ink)
- **Reanimated 4** + **worklets** + **Moti** + **gesture-handler**
- **@shopify/react-native-skia 2** — the 2D peony bloom
- **Zustand 5** + **react-native-mmkv 4** — UI state persistence
- **@react-native-firebase 24** — Auth, Firestore (offline persistence), Messaging (FCM), Functions
- **Cloud Functions v2** (Node 20) — invite accept, partner push fan-out, account deletion cascade
- **Fraunces** (display) + **Inter Tight** (body) via `@expo-google-fonts`
- **Jest** + `jest-expo` — predictions engine has 13 unit tests

## Quickstart

```bash
nvm use                       # Node 20
npm install
npx tsc --noEmit              # typecheck
npm test                      # predictions unit tests
npx expo start                # dev server (requires dev client APK, see below)
```

> Native Firebase requires a custom dev client (Expo Go doesn't include `@react-native-firebase`). Build one once via EAS:
> ```
> eas build --profile development --platform android
> # install resulting APK on your device
> ```
> See [ENV_SETUP.md](./ENV_SETUP.md) for full setup.

## Repo layout

```
src/
├── App.tsx                  → providers + RootNavigator
├── navigation/              → react-navigation v7 setup + deep-link config
├── screens/                 → 1 file per route (Landing, Onboarding, Dashboard, Calendar, Insights, Journal, Partner, Settings, SignIn/Up, ShareAccept)
│   └── dev/                 → ComponentGallery (long-press Settings tab in __DEV__)
├── components/
│   ├── bloom/               → BloomCanvas (Skia 2D peony — 4 Fibonacci-count petal rings)
│   ├── atmosphere/          → Aurora gradient + drifting orb + grain
│   ├── motion/              → Reveal, SplitText, Stagger, PressScale
│   ├── ui/                  → Button, Card, Input, Sheet, Toast
│   ├── log/                 → LogEntryModal + QuickLogFAB
│   ├── calendar/            → MonthGrid + DayCell
│   ├── journal/             → JournalEntry + JournalComposer
│   ├── partner/             → PartnerInviteCard + PartnerMessages
│   └── system/              → SplashGate, ErrorBoundary, PlaceholderScreen
├── lib/
│   ├── predictions.ts       → phase prediction + phaseToMorph
│   ├── invite.ts            → 8-char Crockford base32 code generator
│   ├── deviceTier.ts        → auto-select bloom quality from device class
│   └── cn.ts
├── data/                    → Firestore repos (users, cycles, journal, couples, messages) + paths
├── auth/                    → AuthProvider (anon → email/Google upgrade)
├── stores/                  → Zustand (user/cycle/journal/partner) + MMKV adapter
├── theme/                   → colors / typography / spacing / motion / ThemeProvider
├── hooks/                   → useReducedMotion, useColorScheme, useTimeOfDay, usePhase
├── notifications/           → setup, fcm, scheduler, backgroundFetch
└── types/index.ts           → CycleEntry, UserPeriodData, JournalEntry, CoupleDoc, Message, PhaseSummary, BloomMorph, UserProfile

functions/                   → Firebase Cloud Functions (acceptInvite, onPartnerMessage, deleteUserData)
firestore.rules              → owner-only users; couple-member-gated messages
app.config.ts                → Expo dynamic config (deep links, plugins, package=com.bloom.app)
eas.json                     → development / preview / production profiles
```

## Scripts

| Script | What it does |
|---|---|
| `npm start` | Expo dev server |
| `npm run android` | Open on connected Android device/emulator |
| `npm test` | Jest unit tests |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run build:android:dev` | EAS development build (APK) |
| `npm run build:android:preview` | EAS preview build (APK, internal) |
| `npm run build:android:prod` | EAS production build (AAB) |
| `npm run submit:android` | EAS submit to Play Console |

## What's working today

- ✅ End-to-end period logging (Onboarding → Dashboard → LogEntry → Calendar)
- ✅ Phase prediction with confidence + bloom morph driven by phase + day-in-phase
- ✅ Journal with text entries
- ✅ Partner invite + chat + summon (FCM fan-out via Cloud Function)
- ✅ Deep links (`bloom://share/:code` + `https://bloom.app/share/:code`)
- ✅ Anonymous sign-in by default; upgrade to email/password preserves data
- ✅ Account deletion (server-side cascade via Cloud Function)
- ✅ Local "period in 2 days" notification, daily log reminder
- ✅ Background fetch for daily prediction refresh
- ✅ Reduced-motion respect (OS or in-app override)
- ✅ Auto bloom quality based on device class
- ✅ 13 Jest unit tests for the prediction engine

## What needs you

See [ENV_SETUP.md](./ENV_SETUP.md) to enable Firebase, then [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) to ship to Play Store.
