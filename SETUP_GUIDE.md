# Bloom — beginner setup guide

A step-by-step walkthrough from "I just opened this folder" to "my app is live on the Play Store." Written for someone who has never shipped a React Native app before.

Read top-to-bottom. Each section has commands you can copy and paste, and what you should see when things work. If something breaks, jump to [Troubleshooting](#troubleshooting) at the bottom.

---

## Table of contents

1. [What is Bloom and what are we doing?](#1-what-is-bloom-and-what-are-we-doing)
2. [Costs and accounts you will need](#2-costs-and-accounts-you-will-need)
3. [Glossary — quick terms to know](#3-glossary)
4. [Part A — Set up your computer](#part-a--set-up-your-computer)
5. [Part B — Get the code working on your computer](#part-b--get-the-code-working-on-your-computer)
6. [Part C — Create your Firebase project](#part-c--create-your-firebase-project)
7. [Part D — Wire Firebase into the app](#part-d--wire-firebase-into-the-app)
8. [Part E — Deploy the Firebase backend](#part-e--deploy-the-firebase-backend)
9. [Part F — Build the test app and install it on your phone](#part-f--build-the-test-app-and-install-it-on-your-phone)
10. [Part G — Try the app](#part-g--try-the-app)
11. [Part H — Prepare for the Play Store](#part-h--prepare-for-the-play-store)
12. [Part I — Create the Play Console listing](#part-i--create-the-play-console-listing)
13. [Part J — Build, submit, and roll out the production app](#part-j--build-submit-and-roll-out-the-production-app)
14. [Daily workflow once everything works](#daily-workflow-once-everything-works)
15. [Troubleshooting](#troubleshooting)

---

## 1. What is Bloom and what are we doing?

Bloom is a botanical period tracker built as a React Native mobile app. The code is already written; we are going to:

1. Set up your computer so it can run the code.
2. Create a free Firebase project (the cloud backend that stores user data and sends notifications).
3. Connect the app to your Firebase project.
4. Build a test version of the app and install it on your Android phone.
5. Turn that test version into a production app and publish it on the Google Play Store.

You do not need any prior React Native or Firebase experience. You DO need to be comfortable opening a terminal and copy-pasting commands.

**Time estimate (first time):** about 4-6 hours of hands-on work, spread across a few days while you wait for Firebase emails, Play Console review, EAS build queues, etc.

---

## 2. Costs and accounts you will need

### Free
- A Google account (the one you use for Gmail is fine)
- Node.js, npm, Git, VS Code, Expo CLI, Firebase CLI (all developer tools)
- Firebase "Spark" plan (free tier — covers everything except Cloud Functions)
- A GitHub or Vercel account for hosting your privacy policy (free)

### Paid (required)
- **Google Play Console developer account — $25 one-time fee.** This is what lets you publish apps. Pay once, publish as many apps as you want, forever.
- **Firebase "Blaze" plan — pay-as-you-go, but practically free at low usage.** Required because we use Cloud Functions. For a brand-new app with a handful of users, you will pay $0–$1/month. Firebase only charges past their free tier (which is generous — 2M function calls/month free).

### Hardware
- A computer running macOS, Windows, or Linux. This guide shows macOS commands; Windows users can use WSL or PowerShell with minor adjustments.
- An Android phone (or an Android emulator running on your computer). The phone needs USB debugging enabled.

---

## 3. Glossary

Quick terms you will see throughout this guide:

- **Expo** — a framework that makes building React Native apps much easier. We use the "managed" workflow, which means Expo handles all the native Android stuff for us.
- **EAS (Expo Application Services)** — Expo's cloud build service. Instead of installing Android Studio on your computer (which is huge and complicated), EAS builds your app in the cloud and gives you a download link.
- **APK** — the file format Android uses for app installers. Think of it like a `.exe` on Windows. We use APKs for testing.
- **AAB (Android App Bundle)** — a newer Android file format that the Play Store requires for production. EAS builds both APKs and AABs depending on the profile we use.
- **Firebase** — Google's backend-as-a-service. We use four parts:
  - **Authentication** — handles user sign-in (anonymous, email/password, Google).
  - **Firestore** — the database where we store user data (cycle entries, journal, partner messages).
  - **Cloud Functions** — small server programs that run on Google's servers. We use them for partner-link acceptance, push notification fan-out, and account deletion.
  - **Cloud Messaging (FCM)** — the system that delivers push notifications to phones.
- **Cloud Function** — a small piece of code that runs on Google's servers when triggered (e.g. when a message is sent).
- **`google-services.json`** — a small JSON file from your Firebase project that tells the app "here's how to talk to your backend." Treat it like a config file, not a secret (but don't commit it to public repos).
- **Service account JSON** — a credentials file that lets EAS upload your app to the Play Console automatically. This IS sensitive — never share or commit it.
- **Play Console** — Google's web dashboard where you manage your app's Play Store listing, releases, and statistics.
- **SHA-1 / SHA-256 fingerprint** — a string that identifies the cryptographic key used to sign your app. Firebase needs your SHA-1 so it knows the API requests are coming from your real app and not an impostor.

---

## Part A — Set up your computer

This part installs the tools you need. You only do this once per computer.

### A.1 — Install Node.js (the language Bloom is built with)

Bloom requires Node version 20. The easiest way to manage Node versions is `nvm`.

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Close and reopen your terminal, then:

```bash
# Install Node 20
nvm install 20
nvm use 20

# Check it worked — should print something like "v20.19.6"
node --version
```

If you already have Node 20 installed via another method (Homebrew, the official installer, etc.), that's fine too. Just make sure `node --version` shows v20.

### A.2 — Install Git

You probably already have it. Check:

```bash
git --version
```

If you don't, install with `brew install git` on macOS or download from https://git-scm.com.

### A.3 — Install the global tools we need

```bash
# EAS CLI — used to build the app in the cloud
npm install -g eas-cli

# Firebase CLI — used to deploy security rules and Cloud Functions
npm install -g firebase-tools
```

Verify both work:

```bash
eas --version
firebase --version
```

### A.4 — Install a code editor (optional but recommended)

If you don't already have one, install Visual Studio Code from https://code.visualstudio.com. It's free, runs on every platform, and has great support for the languages we use.

---

## Part B — Get the code working on your computer

### B.1 — Open the project folder

Open your terminal and navigate to the project:

```bash
cd /Users/utkarshsingh/Desktop/Bloom-app
```

(If you opened this guide from inside VS Code, you're already there.)

### B.2 — Make sure Node 20 is active

```bash
nvm use   # picks up .nvmrc which pins Node 20
```

You should see "Now using node v20.x.x".

### B.3 — Install the project's dependencies

This downloads all the JavaScript libraries Bloom uses. First time takes 2-5 minutes.

```bash
npm install
```

When it's done you'll see something like "added 800 packages." You can ignore warnings about deprecated packages.

### B.4 — Verify the code is healthy

Run these three checks:

```bash
# Does the code typecheck cleanly?
npm run typecheck

# Do the unit tests pass?
npm test

# Does Expo's project doctor approve?
npx expo-doctor
```

You should see:
- `typecheck` — no output (means success)
- `test` — "Tests: 13 passed, 13 total"
- `expo-doctor` — "17/17 checks passed"

If anything fails, jump to [Troubleshooting](#troubleshooting).

### B.5 — Open the project in VS Code

```bash
code .
```

The dot means "the current folder." VS Code opens with the whole project. Now you can read code, make small edits, and use the integrated terminal.

You are now at the same starting point a professional developer would be. Everything below is about connecting Bloom to a real backend and publishing it.

---

## Part C — Create your Firebase project

Firebase is the backend. Without it, Bloom can't store data or send messages. Setting up a project takes about 15 minutes.

### C.1 — Open the Firebase Console

In your browser, go to https://console.firebase.google.com. Sign in with your Google account if prompted.

### C.2 — Create a new project

1. Click the big **"Add project"** card (or "Create a project" if this is your first).
2. **Project name:** `Bloom` (or anything you want — this is internal). Click Continue.
3. **Google Analytics:** Click the toggle to disable it. We don't need analytics for v1 and disabling it makes setup faster. Click Continue.
4. Wait ~30 seconds for the project to be created. Click Continue when ready.

You should now see your Firebase project dashboard.

### C.3 — Enable Authentication

In the left sidebar, click **Build → Authentication**, then click **"Get started"**.

You'll see a list of "Sign-in providers." Enable these three:

1. **Anonymous** — click it, flip the Enable toggle, Save. (This lets people use the app without signing in first.)
2. **Email/Password** — click it, flip the Enable toggle for "Email/Password" (leave "Email link" off), Save.
3. **Google** — click it, flip Enable, fill in a "Project support email" (your Gmail address), Save.

You should now see all three providers in the list with green check marks.

### C.4 — Create the Firestore database

In the left sidebar, click **Build → Firestore Database**, then **"Create database"**.

1. **Location:** Pick the region closest to your users. (US users → `us-central`; Europe → `eur3`; India → `asia-south1`.) **This cannot be changed later.**
2. **Start in production mode** (not test mode). Click Create.
3. Wait ~30 seconds.

You'll see an empty database. We'll deploy security rules later that lock it down properly.

### C.5 — Enable Cloud Messaging (push notifications)

In the left sidebar, click **Engage → Messaging**. Click any "Send your first message" type of button — you can close the message composer right away. Just being on the page is enough to register the service.

### C.6 — Upgrade to the Blaze (pay-as-you-go) plan

We need this because Cloud Functions require Blaze. **You will almost certainly not be charged at low usage** — the free tier covers 2 million function calls per month.

1. In the left sidebar, find your current plan name at the bottom (usually says "Spark"). Click **"Upgrade"** next to it.
2. Choose **Blaze**.
3. Set up billing. Google requires a credit card.
4. **Set a budget alert** at $5/month so Google emails you if you ever exceed the free tier. (You almost certainly won't.)
5. Confirm.

### C.7 — Add an Android app to the project

This is where Firebase generates the `google-services.json` file we need.

1. On the project dashboard (the home page of your Firebase project), click the **Android icon** (looks like a little robot).
2. **Android package name:** type exactly `com.bloom.app`
3. **App nickname:** `Bloom` (just a label, doesn't matter)
4. **SHA-1:** leave blank for now — we'll add it in C.8.
5. Click **"Register app"**.
6. **Download `google-services.json`.** Save it somewhere you can find again.
7. Click Next, Next, Continue to console. Skip any "Add SDK" instructions — our app already has those.

### C.8 — Get the SHA-1 fingerprint and add it to Firebase

The SHA-1 is a string that proves your app is your app. Without it, Google Sign-In won't work.

We'll get the SHA-1 from EAS. But we need to set up EAS first — so do this:

```bash
# In your terminal, in the Bloom-app folder
eas login
```

This opens a browser for you to log into Expo. Create a free Expo account if you don't have one.

```bash
eas init
```

This creates an Expo project tied to your Expo account and writes the project ID into your config. Accept the defaults.

```bash
# Generate the Android credentials (signing keys for dev/preview/prod)
eas credentials
```

Pick:
- **Android** (when asked for platform)
- **production** (when asked for build profile)
- **Build credentials → Setup a new keystore**

EAS will generate a keystore and store it on their servers. After it's done, run:

```bash
eas credentials
```

Again, but this time pick **Android → production → Build credentials → Existing keystore → Show**. You'll see a fingerprint that looks like this:

```
SHA1 Fingerprint: AB:CD:EF:12:34:...
SHA256 Fingerprint: AB:CD:EF:12:34:...
```

**Copy the SHA1 line.** (You'll need the SHA-256 later for App Links.)

Now back in the Firebase Console:
1. Click the gear icon (top-left, next to "Project Overview") → **Project settings**.
2. Scroll to the "Your apps" section. Find your Android app and click **"Add fingerprint"**.
3. Paste the SHA-1 you copied. Save.

Repeat the same `eas credentials` process for the `development` and `preview` profiles and add both their SHA-1s to Firebase too. You can have multiple SHA-1s — Firebase needs one for each build profile because each profile signs with a different key.

### C.9 — Recap: what you should have now

- A Firebase project named Bloom
- Authentication enabled with Anonymous, Email/Password, and Google providers
- A Firestore database in production mode
- Cloud Messaging enabled
- Blaze plan with a $5 budget alert
- An Android app registered with package `com.bloom.app`
- The `google-services.json` file downloaded to your computer
- SHA-1 fingerprints added to Firebase for dev/preview/production EAS profiles

---

## Part D — Wire Firebase into the app

### D.1 — Drop `google-services.json` into the project

Move the file you downloaded in C.7 into the Bloom-app folder, at the very top level:

```bash
mv ~/Downloads/google-services.json /Users/utkarshsingh/Desktop/Bloom-app/google-services.json
```

Verify it's there:

```bash
ls /Users/utkarshsingh/Desktop/Bloom-app/google-services.json
```

The file is gitignored, so it won't accidentally get committed.

### D.2 — Upload the file as an EAS secret

When EAS builds the app in the cloud, it doesn't have access to your local files. So we upload `google-services.json` to EAS as a "secret file." EAS will inject it into the build at the right path.

```bash
eas secret:create --type file --name GOOGLE_SERVICES_FILE --value ./google-services.json
```

You should see "Created a new secret GOOGLE_SERVICES_FILE."

### D.3 — Smoke test the config

```bash
npx expo config --type public
```

This prints the resolved app configuration. Scroll through and confirm:
- `name: 'Bloom'`
- `android.package: 'com.bloom.app'`
- `android.googleServicesFile` points at `./google-services.json`

If you see all three, Firebase is wired up.

---

## Part E — Deploy the Firebase backend

This part deploys two things to your Firebase project:

1. **Security rules** — the rules that say "users can only read their own data."
2. **Cloud Functions** — the server code that handles partner invites, push notifications, and account deletion.

### E.1 — Log into Firebase from your terminal

```bash
firebase login
```

A browser opens. Pick the same Google account you used in the Firebase Console.

### E.2 — Tell Firebase CLI which project to use

```bash
firebase use --add
```

You'll see a list of your projects. Pick the Bloom one. Give it an alias like `default`.

### E.3 — Deploy the security rules

The rules file (`firestore.rules`) is already in the project.

```bash
firebase deploy --only firestore:rules
```

After ~30 seconds you'll see "Deploy complete!" Now your Firestore database is locked down — only authenticated users can read their own data.

### E.4 — Install the Cloud Functions dependencies

The `functions/` folder is a separate Node.js project (with its own `package.json`). Install its dependencies:

```bash
cd functions
npm install
cd ..
```

### E.5 — Deploy the Cloud Functions

```bash
firebase deploy --only functions
```

This takes 3-5 minutes the first time because Google has to build a container for your code. You'll see lines like:

```
+  functions[acceptInvite(us-central1)] Successful create operation.
+  functions[onPartnerMessage(us-central1)] Successful create operation.
+  functions[deleteUserData(us-central1)] Successful create operation.
```

When you see "Deploy complete!" your backend is fully live. You can verify in the Firebase Console under **Build → Functions** — you should see three functions listed.

### E.6 — Recap

- `firestore.rules` deployed (your data is now access-controlled)
- 3 Cloud Functions deployed (`acceptInvite`, `onPartnerMessage`, `deleteUserData`)

You only re-run E.3 and E.5 when you change the rules file or the functions code. They live in the cloud forever otherwise.

---

## Part F — Build the test app and install it on your phone

We can't run Bloom in "Expo Go" (the easy-mode Expo app) because Bloom uses native Firebase, which Expo Go doesn't include. Instead, we build a custom "development client" APK once, install it on your phone, and from then on we can develop with hot-reload just like Expo Go.

### F.1 — Build the development client

```bash
eas build --profile development --platform android
```

You'll be asked a few questions; accept defaults. Then EAS starts building in the cloud. Watch the URL it prints — that's your build's progress page.

**This takes 10-25 minutes the first time.** Go make tea. Subsequent builds are faster (2-10 min) because EAS caches.

When it's done, you'll get a link to download the APK. Open that link on your Android phone (or scan the QR code shown in your terminal).

### F.2 — Enable "Install from unknown sources" on your phone

When you tap the downloaded APK, Android will warn you that the file is from an unknown source. This is expected because the APK is signed with your dev key, not the Play Store key.

1. Tap "Settings" in the warning dialog.
2. Toggle "Allow from this source" (or similar wording).
3. Go back and tap Install.

### F.3 — Start the dev server on your computer

```bash
npx expo start --dev-client
```

A QR code will appear in your terminal. Open the Bloom dev client app on your phone and scan it. The app will connect to your computer and load the latest code.

(If the QR scan doesn't work, your phone and computer need to be on the same Wi-Fi network.)

### F.4 — Hot reload

Any time you save a file in VS Code, the app on your phone reloads automatically with the change. This is the loop you'll work in for the rest of the project.

To stop the dev server, press Ctrl+C in the terminal.

---

## Part G — Try the app

With the dev client running, walk through these flows to confirm everything works end-to-end:

### G.1 — First-launch flow

1. Open the app on your phone. You should see the Landing screen with the bloom and "Begin" button.
2. Tap **Begin** → goes to Onboarding.
3. Type a name, swipe right.
4. Pick a date (your last period start). Swipe right.
5. Set cycle length. Swipe right.
6. Decide on notifications. Tap **Begin**.

You should land on the Dashboard with the bloom morphed to your current phase. The bottom tab bar shows Dashboard / Calendar / Insights / Journal / Partner / Settings.

### G.2 — Log an entry

1. Tap the big terracotta **+** button (bottom-right).
2. Pick a flow, mood, a couple of symptoms, write a note.
3. Tap **Save**.

You should see:
- A small celebration of petals scatter from the screen center (the PetalBurst).
- A "Logged." toast appear at the bottom.
- The Calendar tab now shows a colored cell on that day.

### G.3 — Partner flow (needs two devices)

1. On device A: tap Partner tab → tap "Generate invite" → copy the 8-character code.
2. On device B: open the Partner share link in any browser (or use deep-link testing: `adb shell am start -a android.intent.action.VIEW -d "bloom://share/YOUR_CODE"`)
3. On device B, you should see the ShareAccept screen. Tap **Accept**.
4. Both devices should now show the chat view.
5. Send a message or tap the heart to send a "thinking of you" summon.

If device B has notifications enabled, device A should get a push notification from the `onPartnerMessage` Cloud Function.

### G.4 — Settings

1. Open Settings tab.
2. Verify your name is shown.
3. Try the Reduce Motion toggle — the bloom should stop springing.
4. Try Bloom Quality → Low — fewer petals.
5. Try Delete Account (it really will delete your data). Re-onboard after.

If everything works, you're ready to prepare for the Play Store.

---

## Part H — Prepare for the Play Store

The Play Store requires several things you can't generate from code: an app icon, screenshots, a privacy policy, and so on. Let's tackle them one at a time.

### H.1 — Design the app icon and splash screen

You need three images:

| File | Size | Purpose |
|---|---|---|
| `assets/icon.png` | 1024×1024 PNG | The app icon shown on the home screen |
| `assets/adaptive-icon.png` | 1024×1024 PNG | Foreground layer of the adaptive icon (Android wraps the background in a circle/square based on the device) |
| `assets/splash-icon.png` | 1284×2778 PNG | The screen shown while the app loads |

For each, **the safe zone is the inner 66%** — anything outside that circle gets cropped on round-icon devices.

If you're not a designer:
- Use Figma's free tier (https://figma.com) and search the community for "app icon template."
- Or hire someone on Fiverr for $20-50.
- For a placeholder, use the existing `assets/icon.png` (Expo's default green leaf) — you can replace it later. The app will work fine, it just won't look like Bloom.

Drop your finished files into `Bloom-app/assets/`, overwriting the existing placeholders.

### H.2 — Take screenshots

You need at least 2, ideally 6-8 screenshots in vertical orientation at 1080×1920 or higher.

**Easy way:** Open the app on your Android phone. Press Power + Volume Down at the same time on most phones. The screenshot lands in your phone's photo gallery; transfer to your computer.

Capture:
1. Landing page with the bloom
2. Onboarding (step with the date picker)
3. Dashboard with the bloom in ovulation phase (use the preview chips if you don't have real data)
4. Calendar with several flow-colored cells
5. Journal with two entries
6. Partner chat with a sent message
7. Settings

### H.3 — Write a privacy policy

Required by law and required by the Play Store. You can:

**Easy option — generator:** Use https://app.termly.io/dashboard/website/new (free for basic policies). Tell it:
- App name: Bloom
- Data you collect: name, email, health & fitness data, messages, audio recordings, FCM tokens, device IDs
- Data processors: Google Firebase
- Users can request data deletion: Yes (in-app)
- Contact email: your email

It generates a policy you can copy into a webpage.

**Free hosting:** create a free GitHub account, make a new public repo called `bloom-privacy`, drop the HTML in `index.html`, enable GitHub Pages in repo Settings. You'll get a URL like `https://yourusername.github.io/bloom-privacy/`. Copy that URL — you'll need it.

### H.4 — Update the privacy URL in the app

Open `src/screens/SettingsScreen.tsx` in VS Code. Near the top you'll see:

```ts
const PRIVACY_URL = 'https://bloom.app/privacy'; // TODO: actual URL in M8
```

Change `'https://bloom.app/privacy'` to your real URL from H.3. Save. Commit:

```bash
git add src/screens/SettingsScreen.tsx
git commit -m "chore: real privacy policy URL"
```

### H.5 — Decide your final package name

In `app.config.ts`, the line `const PACKAGE_NAME = 'com.bloom.app';` determines your app's identity on Android. **This name cannot be changed after you publish.** Before submitting, search Google Play for `com.bloom.app` — if it's taken by someone else, you need to pick a different one.

Alternatives if taken:
- `app.bloom.cycle`
- `co.bloom.android`
- `com.bloomapp.bloom`

If you change it, also change it in:
- `app.config.ts` (both `PACKAGE_NAME` and `BUNDLE_ID`)
- Firebase Console → Project settings → delete and re-add the Android app with the new package name

---

## Part I — Create the Play Console listing

### I.1 — Pay the $25 developer fee

Go to https://play.google.com/console. Sign in with the Google account you want to publish under (you can switch later, but it's complicated). Pay the one-time $25 fee.

Wait up to 48 hours for Google to approve your developer account.

### I.2 — Create the app in Play Console

Once approved:

1. Click **"Create app"**.
2. **App name:** "Bloom — Period & Cycle Tracker"
3. **Default language:** English (US) or your choice.
4. **App or game:** App.
5. **Free or paid:** Free (you can change later).
6. **Declarations:** Tick both (developer policies and US export laws).
7. Click **Create app**.

### I.3 — Fill out the Store Listing

In the left sidebar, click **Grow → Store presence → Main store listing**.

- **App name:** Bloom — Period & Cycle Tracker
- **Short description (80 chars max):** "A gentle botanical period tracker for you and your person."
- **Full description (4000 chars max):** Write 3-4 paragraphs explaining the app, its features, your privacy stance, etc. Include keywords like "period tracker," "cycle tracker," "menstrual," "fertility window."
- **App icon:** Upload your 1024×1024 icon.
- **Feature graphic:** Upload a 1024×500 banner. Use Figma or Canva to make one.
- **Phone screenshots:** Upload 2-8 of the screenshots from H.2.

Click **Save**.

### I.4 — Fill out the Data Safety form

This is the section that took the most rejections of any app feature in 2024-2025, so be careful.

Sidebar → **Policy → App content → Data safety**.

Walk through the wizard:

**Data collection and security:**
- Do you collect or share user data? **Yes**
- Is data encrypted in transit? **Yes**
- Do you provide a way to request data deletion? **Yes**

**Data types collected:**
- Personal info: **Name, Email address**
- Health and fitness: **Health info** (cycle data)
- Messages: **Other in-app messages** (partner chat)
- Audio files: **Voice or sound recordings** (only if you plan to enable journal audio — leave off for v1)
- App activity: **App interactions**
- Device or other IDs: **Device or other IDs** (FCM token)

For each, mark:
- Collected: **Yes**
- Shared with third parties: **No** (Firebase is a processor, not a third party)
- Required or optional: most are **Optional**, except name + email which are **Required** when signing in
- Purpose: **App functionality**

Click Save and then Submit when prompted.

### I.5 — App content questionnaire

Sidebar → **Policy → App content → App content**. Walk through each card:

- Privacy policy: paste the URL from H.3
- App access: All functionality is available without restriction (Yes)
- Ads: No
- Content rating: complete the questionnaire (Bloom is a wellness app — no violence, no nudity, etc. → likely Teen rating)
- Target audience: Age 13+
- News app: No
- Data safety: already done in I.4
- Government app: No
- Financial features: No
- Health features: **Yes** (period tracking) — Google may ask you to comply with their health data policies, which Bloom already does

### I.6 — Create the service account for `eas submit`

This lets EAS automatically upload new builds to the Play Console without you having to log in every time.

1. In Play Console, sidebar → **Setup → API access**.
2. If you see "Service account" section, scroll there. If not, you may need to link a Google Cloud project first (Play Console will walk you through it).
3. Click **Create new service account**.
4. A new tab opens in Google Cloud Console. There:
   - Click **Create Service Account**.
   - Name: `bloom-play-submit`
   - Description: "EAS submit"
   - Skip the role for now. Click Done.
5. In the service accounts list, find the one you just made, click the three-dot menu → **Manage keys**.
6. Click **Add Key → Create new key → JSON**. A JSON file downloads.
7. **Move it to your Bloom-app folder and rename it:**

```bash
mv ~/Downloads/bloom-play-submit-*.json /Users/utkarshsingh/Desktop/Bloom-app/play-service-account.json
```

This file is gitignored. Do not share it.

8. Go back to Play Console → API access. Refresh the page. Your new service account should appear. Click **Grant access** next to it.
9. Permissions: **Releases → Release manager** (and "View app information" should be checked automatically). Click Apply.

---

## Part J — Build, submit, and roll out the production app

### J.1 — Build the production AAB

```bash
eas build --profile production --platform android
```

Takes 10-25 minutes in the cloud. The output is an AAB file (not an APK — AABs are what the Play Store accepts).

### J.2 — Submit to Play Console

```bash
eas submit --profile production --platform android
```

EAS uses your `play-service-account.json` to upload the AAB. After ~2 minutes you'll see "Successfully uploaded."

### J.3 — Choose a release track

Open Play Console → **Release → Testing → Internal testing** (start here).

1. Click **Create new release**.
2. The AAB you just uploaded should appear in the "App bundles" section. Select it.
3. **Release name:** auto-filled, leave as-is.
4. **Release notes:** "Initial test build." in the EN-US box.
5. Click **Save → Review release → Start rollout to Internal testing**.

In the same Internal testing page, click the **Testers** tab. Add an email list (just your email + a few trusted friends). Save.

Below the testers list, copy the **opt-in URL** and open it on your phone. Click "Become a tester." After ~10 minutes, the app will be available in the Play Store on your tester device (search for "Bloom" or open the link Play Console gives you).

**This is the same code as your dev build but signed with the production key.** It's the version that will eventually go to the public.

### J.4 — Watch for crashes for 48 hours

Open Play Console → **Quality → Android vitals**. You'll see crash and ANR (App Not Responding) reports. If you see anything alarming, fix it and submit a new build. If after 48 hours you're at 100% crash-free, move on.

### J.5 — Promote to Closed → Open → Production

In Play Console → Release → Testing:

1. **Closed testing:** add 20-50 trusted users. Watch for feedback for a week. Iterate.
2. **Open testing:** anyone with the link can join. Watch crash-free rate.
3. **Production:** **Release → Production → Create new release**. Same process as before, but this time pick **Staged rollout** and start at 5%. Increase to 20%, 50%, 100% over a week. Halt and roll back if crash-free rate drops below 99.5%.

Once you're at 100% production rollout, your app is live worldwide.

---

## Daily workflow once everything works

When you want to make changes after the first release:

### For JS-only changes (UI tweaks, copy, small bug fixes)

Use **expo-updates** — pushes the fix instantly without resubmitting to the Play Store.

```bash
# After making your code change
eas update --branch production --message "fix typo on Dashboard"
```

Existing users get the update next time they open the app.

### For changes that touch native code or new permissions

You have to rebuild + resubmit:

```bash
eas build --profile production --platform android
eas submit --profile production --platform android
```

Then create a new release in Play Console.

### For local development

```bash
npx expo start --dev-client
```

Make sure the dev client APK on your phone matches the current dependencies. If you install a new native module (anything with `expo install`), you need to rebuild the dev client with `eas build --profile development --platform android`.

### Cloud Functions / Firestore rules changes

```bash
firebase deploy --only firestore:rules         # rules only
firebase deploy --only functions               # functions only
firebase deploy                                # everything
```

---

## Troubleshooting

### "command not found: npm" / "command not found: node"

Node isn't installed or not in your PATH. Re-run Part A.1.

### `npm install` fails with permission errors

Don't use `sudo`. Try:

```bash
nvm use 20
rm -rf node_modules package-lock.json
npm install
```

### `npm test` errors with "Cannot find module"

Re-run `npm install` from a fresh `node_modules`:

```bash
rm -rf node_modules
npm install
npm test
```

### `eas build` fails: "Cannot find google-services.json"

You skipped D.2. Run:

```bash
eas secret:create --type file --name GOOGLE_SERVICES_FILE --value ./google-services.json
```

### App installs but crashes immediately when opened

Most likely cause: SHA-1 fingerprint mismatch. The app's signing key doesn't match what's in Firebase. Go back to C.8 and make sure you added the SHA-1 for THIS build profile (dev/preview/prod).

After adding a fingerprint, you need to re-download `google-services.json` from Firebase Console (Project settings → your Android app → Download google-services.json), replace it in the project, re-run `eas secret:create --type file --name GOOGLE_SERVICES_FILE --value ./google-services.json --force`, and rebuild.

### Google Sign-In fails with "DEVELOPER_ERROR"

Same root cause as above — SHA-1 missing or wrong in Firebase.

### Push notifications never arrive

1. Did the user grant notification permission? Go to phone Settings → Apps → Bloom → Notifications → enable.
2. Did `messaging().registerDeviceForRemoteMessages()` succeed? Check the JS logs in `npx expo start --dev-client`.
3. Is the FCM token saved in Firestore? Check Firebase Console → Firestore → users/{uid} → fcmTokens.
4. Are you on a Chinese OEM (Xiaomi, Oppo, Vivo)? They aggressively kill background apps. Tell the user to add Bloom to the "Battery whitelist" or "Auto-start" list in phone Settings.

### `firebase deploy --only functions` fails with "Error: HTTP Error: 403"

You're not logged into the right account, or the Firebase project doesn't have Blaze enabled.

```bash
firebase logout
firebase login
firebase use --add   # pick the right project
```

If still failing, verify Blaze is active in Firebase Console → bottom-left "Plan" indicator.

### Deep link `bloom://share/CODE` doesn't open the app

Run in your terminal with the phone connected via USB:

```bash
adb shell am start -a android.intent.action.VIEW -d "bloom://share/ABCD1234"
```

If nothing happens, the dev build doesn't have the intent filter — rebuild with `eas build --profile development --platform android`. If it works but the universal link (`https://bloom.app/share/X`) doesn't, you need to host an `assetlinks.json` file at `https://bloom.app/.well-known/assetlinks.json` matching your package + SHA-256. Search "Android App Links assetlinks" for Google's verification tool.

### "The package name X is already in use"

Someone took `com.bloom.app`. Pick a different one in `app.config.ts` (see H.5).

### Play Console rejects the data safety form

Read the rejection email carefully. The most common issue is forgetting to declare something — e.g. if you have analytics enabled but didn't declare it, they'll reject. Re-walk I.4 with the rejection notes in mind.

### EAS build is stuck in queue

Free tier EAS builds wait in a queue that can be 30+ minutes when busy. If urgent, you can pay $19/month for priority builds. Or just wait.

### I see a warning about overrides / duplicate React

Already handled in `package.json` overrides. If you see a NEW duplicate warning after installing a package, add it to the overrides block:

```json
"overrides": {
  "react": "19.1.0",
  "react-dom": "19.1.0"
}
```

Re-run `npm install` (delete `node_modules` first).

### Nothing in this section helped

Open an issue in your repo, or ask in the Expo Discord (https://chat.expo.dev). Paste:
1. The exact command you ran
2. The exact error message (full text)
3. Your platform (macOS / Windows / Linux) and Node version
4. Your Expo SDK version (from `package.json`)
