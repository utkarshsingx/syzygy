# Bloom — environment setup

Steps to take this repo from "compiles cleanly" to "runs on a real Android device with Firebase syncing."

## 1. Node + tools

```bash
nvm use            # picks up .nvmrc (Node 20)
npm install
npm install -g eas-cli firebase-tools
```

## 2. Firebase project

1. Go to https://console.firebase.google.com/ → **Add project** → name it **Bloom** (or whatever you want).
2. **Enable services:**
   - Authentication → Sign-in methods → enable **Anonymous**, **Email/Password**, and **Google**.
   - Firestore → **Create database** → start in **Production mode** in your nearest region.
   - Cloud Messaging → no setup needed beyond enabling.
3. **Add an Android app** to the project:
   - Package name: `com.bloom.app`
   - Get the SHA-1 fingerprint for the **dev** build from EAS:
     ```bash
     eas credentials -p android
     # → choose your project → Build Credentials → list → copy SHA-1
     ```
   - Paste SHA-1 into the Firebase console.
   - Download `google-services.json`.
4. Drop the file at the repo root:
   ```bash
   mv ~/Downloads/google-services.json ./google-services.json
   ```
   (Already gitignored. For CI/EAS Build, upload via `eas secret:create --type file --name GOOGLE_SERVICES_FILE --value ./google-services.json`.)

## 3. Deploy Firestore security rules

```bash
firebase login
firebase init firestore        # accept defaults; point rules to firestore.rules
firebase deploy --only firestore:rules
```

## 4. Google Sign-In (for SignIn screen, M5 work)

1. Firebase console → Authentication → Google → check the **Web client ID** that was auto-generated.
2. We'll use that in M5 when wiring `@react-native-google-signin/google-signin`.

## 5. First dev build

```bash
eas login
eas init                       # creates EAS project, sets EAS_PROJECT_ID
eas build -p android --profile development
# install the resulting APK on your device; run `npx expo start --dev-client` to develop
```

## 6. Production build

```bash
eas build -p android --profile production
# produces an AAB ready for Play Console
eas submit -p android --profile production
```

## What still needs your input later

- **M6** — Cloud Functions need a Blaze (pay-as-you-go) Firebase plan to deploy
- **M7** — App icon design (1024×1024 + adaptive foreground)
- **M8** — Privacy policy URL (host on Vercel/GitHub Pages), Play Console developer account ($25 one-time), Play service account JSON for `eas submit`
