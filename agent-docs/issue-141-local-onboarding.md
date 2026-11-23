# Local onboarding and SQLite verification

[#141](https://github.com/open-source-fitness/open-fit/issues/141) switches the
production app to local display-name onboarding and uses SQLite for workout
templates. The app ships the RepDB catalog and flat illustrations. Workout
history still shows labeled samples.

## Verified in the worktree

- On Node 24.12.0, `npm ci`, `npm run typecheck`, `npm test` (109 tests in 22
  suites), and `npx expo-doctor` (20 checks) passed.
- The Expo Router tests start the default app with a fresh database and use
  Node's SQLite engine with the Expo SQLite bridge substituted. With JavaScript
  fetch disabled, the tests dismiss the device storage and backup pop-up, require
  a nonblank display name, greet the user on Templates, inspect both poses of a
  bundled exercise, and save a template. They close the database, remount the
  app, reopen the template, edit it, and delete it.
- A pre-cutover SQLite schema version 2 fixture retains its saved template and
  set targets after migration. A name edited in Settings and the Dark
  appearance both survive an app remount. The remaining SQLite and router
  tests cover draft navigation, cancellation, reordering, snapshots, rollback,
  save retries, and sample history.
- Both iOS and Android Expo exports passed with the Supabase environment
  variables unset, dotenv loading disabled, and Expo offline mode enabled.
  Each bundle contains the local SQLite composition and RepDB instructions.
  Both export manifests reference all 1,203 RepDB illustrations, totaling
  19,804,900 bytes before application packaging. The Hermes bundles measure
  5,327,488 bytes for iOS and 5,317,600 for Android. Source maps contain no
  Supabase runtime or legacy account routes.
- Android release assembly passed from a clean copy of cutover revision
  `644b22d` using Expo prebuild and Gradle. The resulting universal APK was
  127,559,668 bytes. All 1,231 packaged RepDB illustrations matched their source
  WebP files by SHA-256. The APK was inspected locally without installing it.

At the time of this verification, the retired account implementation was
still present in the worktree.
`auth-navigation.test.tsx`, `auth-sessions.test.tsx`, and
`production-template-access.test.tsx` exercise the retired router and are
excluded from the active Jest and TypeScript checks for this run.

## iOS Expo Go smoke test

On November 22, 2026, a project maintainer reported that the app appeared to
work correctly on iOS in Expo Go. No device model, OS version, or individual
scenario results were reported.

## Android standalone device audit

The maintainer confirmed that both Android audit APKs installed in airplane mode,
including the in-place update from version code 1 to version code 2. App data
survived closing and reopening the app and installing the update. The maintainer
reported a delay of approximately two to five seconds when opening the exercise
catalog. The phone model and Android version were not reported.

On an Android Hermes release build in airplane mode, the original English sort
took 2.03–4.76 seconds over four catalog visits. Reusing one English collator
took 2.71–4.29 milliseconds for the same 708 exercises and produced identical
ordering in each visit. This measures sorting on an emulator. The updated
timing has not been measured on the maintainer’s phone.
