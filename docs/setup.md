# Setup

## Prerequisites

- Node.js 24 (`.nvmrc`) and npm. With nvm, run `nvm install` and `nvm use`.
- Expo Go supporting SDK 58 on an iPhone or Android device.
- A computer and phone on the same Wi-Fi network when using Expo Go over LAN.

For SDK upgrades, follow [Expo's guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/),
then run `npx expo install --fix` and `npx expo-doctor`.

The app uses on-device SQLite and a bundled RepDB exercise catalog. First launch
will ask for a display name. App development requires no backend credentials or
environment file.

## Install and launch

```sh
git clone https://github.com/open-source-fitness/open-fit.git
cd open-fit
npm ci
npm start
```

`npm start` runs `expo start --go` on port 8081 by default; keep this terminal running.
`npm ci` also generates Metro's illustration index from the pinned RepDB
package. Run `npm run postinstall` to regenerate it after an install with
lifecycle scripts disabled.

1. Install the matching Expo Go build; sign into Expo Go and the CLI if prompted
   (`npx expo login`). Android builds are at [Expo Go downloads](https://expo.dev/go).
2. Join the computer's Wi-Fi network. On iPhone, scan the terminal QR code with
   Camera and open in Expo Go; on Android, scan from Expo Go.
3. Allow local network access if prompted. Stop the server with Ctrl+C.

For configured simulators/emulators, use `npm run ios` (Xcode) or
`npm run android` (Android Studio).
If LAN access fails, check permissions, VPN, firewall, and Wi-Fi device isolation.
Alternatively, install `npm install --global @expo/ngrok` and run
`npm start -- --tunnel`; tunneling requires internet.

## Checks

```sh
npm run typecheck
npm test
npx expo-doctor
EXPO_OFFLINE=1 EXPO_NO_DOTENV=1 npx expo export --platform ios --platform android --output-dir dist
```

These commands check types, Jest behavior, Expo dependencies, and native JavaScript bundles.

There is a chance that some of the Expo dependencies are outdated. If so, simply run the suggested command: 

```sh
npx expo install --check
```

When the dependency check passes it should say something like this: `20/20 checks passed. No issues detected!`

## Local template storage development

Run `npm test -- --runTestsByPath __tests__/sqlite-template-creation.test.tsx`
to test the existing routes against disposable database files. Node's SQLite
engine runs the app's SQL through a stub for the Expo native bridge. The
test suite covers onboarding, renaming, migration of an existing local database,
template CRUD, reorder, cancel, reopen, rollback, and retry after a commit.

The display name and workout templates share one versioned database. Each
template is stored as one row with its exercise snapshots and ordered sets.
Save receipts commit with the template so a retry from the same open draft can
recover its result without reversing a newer edit. Deletion removes the template
and its receipts in one transaction. It retains the template ID so delayed saves
cannot restore it.


## Frontend structure

- `app/`: Expo Router onboarding, Settings, and guarded training tabs.
- `src/views/`: Native screens rendering ViewModel state.
- `src/viewmodels/`: Display name, theme, loading/retry, catalog, and template drafts.
- `src/models/`: Templates, sessions, exercises, snapshots, and validation.
- `src/services/`: Async service contracts, SQLite, sample workout history,
  bundled catalog mapping, and appearance storage.
- `src/theme/`: Shared light/dark colors.

The root layout supplies the display-name store, workout service, bundled catalog,
and appearance store. The name store and workout service share a lazy SQLite
connection. Catalog details share the open visit's selected record. Adding an
exercise copies a snapshot into the draft. See the
[offline catalog verification](../agent-docs/issue-138-offline-catalog.md).

## Historical backend

See the [historical backend notes](maintainers.md) for links to the former
Supabase workflow and its verification records in Git history.
