# Bloom — Play Store launch checklist

End-to-end path from "code compiles" to "live in Play Store production." The
foundation is in place; the items below are what only you can do.

## Phase A — Firebase + first device build

- [ ] Create Firebase project (Bloom) at https://console.firebase.google.com
- [ ] Enable Auth methods: Anonymous, Email/Password, Google
- [ ] Create Firestore database (Production mode, nearest region)
- [ ] Upgrade to **Blaze pay-as-you-go plan** (required for Cloud Functions)
- [ ] Add Android app with package name `com.bloom.app`
- [ ] Add SHA-1 fingerprint from `eas credentials -p android` for each profile (dev, preview, prod)
- [ ] Download `google-services.json` → drop at repo root
- [ ] Deploy security rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Cloud Functions: `cd functions && npm install && firebase deploy --only functions`
- [ ] First dev build: `eas build --profile development -p android`
- [ ] Install APK on a real Android device
- [ ] Smoke test: onboarding → log entry → see it on Calendar

> Detailed step-by-step in [ENV_SETUP.md](./ENV_SETUP.md).

## Phase B — Branding & assets

- [ ] App icon (1024×1024 PNG) → `assets/icon.png`
- [ ] Adaptive icon foreground (1024×1024 PNG with safe zone) → `assets/adaptive-icon.png`
- [ ] Splash image (1284×2778 PNG, Cream background `#F5EFE4` + Fraunces "bloom" wordmark) → `assets/splash-icon.png`
- [ ] Feature graphic (1024×500 PNG) for Play Console
- [ ] Phone screenshots — capture 6+ from the production build:
  - Landing with bloom
  - Onboarding step 2 (date picker)
  - Dashboard with bloom in ovulation phase
  - Calendar with several flow-tinted cells
  - Journal with two entries
  - Partner chat with a summon visible
  - Settings

## Phase C — Compliance

- [ ] **Privacy policy** drafted (cover: email, name, health/fitness, messages, audio, app activity, device IDs; processors: Google Firebase; retention; deletion mechanism; contact email)
- [ ] Privacy policy URL hosted on Vercel / GitHub Pages / etc.
- [ ] Update `src/screens/SettingsScreen.tsx` `PRIVACY_URL` constant with real URL
- [ ] **Account deletion verified end-to-end** — Settings → Delete account → confirm `users/{uid}` subtree gone in Firebase Console (Cloud Function `deleteUserData` must be deployed)
- [ ] **Android App Links verification** — host `assetlinks.json` at `https://bloom.app/.well-known/assetlinks.json` matching the package + SHA-256 of the upload key
- [ ] Test deep links: `adb shell am start -a android.intent.action.VIEW -d "https://bloom.app/share/ABCD1234"`

## Phase D — Play Console

- [ ] Pay $25 Google Play Console developer fee
- [ ] Create app in Play Console
  - Name: "Bloom — Period & Cycle Tracker"
  - Category: Health & Fitness
  - Content rating: Teen (likely)
- [ ] Set up app signing — EAS uploads with the upload keystore; Google holds the prod signing key
- [ ] **Data safety form**:
  - Data collected: email, name, health/fitness (cycle data), messages, audio, app activity, device IDs
  - Shared: none
  - Encrypted in transit: yes (Firestore over HTTPS)
  - User-requested deletion: yes (in-app)
- [ ] Privacy policy URL pasted into Play Console
- [ ] Upload screenshots + feature graphic + icon
- [ ] Short description (≤80 chars): "A gentle botanical period tracker for you and your person."
- [ ] Full description (≤4000 chars)
- [ ] Service account JSON for `eas submit`:
  - Play Console → Setup → API access → Create service account → grant "Release manager" role
  - Download JSON → drop at repo root as `play-service-account.json` (gitignored)

## Phase E — Rollout

- [ ] **Internal testing** (week 1)
  ```
  eas build --profile production --platform android
  eas submit --profile production --platform android
  # AAB lands in Play Console → Internal testing track
  ```
  - Add 5+ testers via email
  - Watch Crashlytics for 48h
  - Pass = 0 P0 crashes
- [ ] **Closed testing** (week 2)
  - Add 20-50 trusted users
  - Iterate on feedback — use `expo-updates` for JS-only fixes (no AAB resubmit)
- [ ] **Open testing** (week 3)
  - Public opt-in link
  - Tune bloom quality auto-detection if low-end devices report jank
  - Finalize all screenshots from real devices
- [ ] **Production** (week 4)
  - Staged rollout: 5% → 20% → 50% → 100% over 5 days
  - Halt if crash-free rate < 99.5%

## Phase F — Post-launch (Phase 2 ideas)

- [ ] iOS build (`eas build -p ios`) + App Store submission
- [ ] Voice journal entries (expo-av + Firebase Storage upload)
- [ ] Victory-native v41 charts (cycle history, mood heatmap, symptom rings)
- [ ] Google Sign-In wired (@react-native-google-signin/google-signin)
- [ ] Cross-platform import: web users export JSON → mobile imports on sign-in
- [ ] Sentry for JS error tracking (Crashlytics covers natives)
- [ ] In-app purchase if monetizing

## Quick-reference commands

```bash
# build
eas build --profile development --platform android
eas build --profile preview --platform android
eas build --profile production --platform android

# submit
eas submit --profile production --platform android

# Firebase
firebase deploy --only firestore:rules
cd functions && firebase deploy --only functions

# OTA update (no resubmit)
eas update --branch production --message "fix copy on Dashboard"

# logs
eas build:list
firebase functions:log
```
