# Getting SpendVoice to users

SpendVoice is a web app first. The same build can reach users in four ways. Each row shows what you must do yourself, because accounts, signing keys, and store reviews belong to you.

| Channel | What users get | Your steps | Cost |
|---|---|---|---|
| **Web link** | Opens in any browser | Host `dist/` on HTTPS (this repo's Pages workflow does it) | Free |
| **Install to home screen** | Full-screen app icon, offline use, on Android, iPhone, and desktop | Nothing extra. The manifest and service worker are included | Free |
| **Google Play** | App listing | Wrap the site as a Trusted Web Activity with Bubblewrap, publish `/.well-known/assetlinks.json` on your domain, create a Google Play developer account, and submit | One-time fee (about $25) |
| **Apple App Store** | App listing | Wrap the site with Capacitor, build on a Mac with Xcode, create an Apple Developer account, and submit for review | Yearly fee (about $99) |

## Before any store submission

1. **Own a domain** and serve the app over HTTPS. Stores and Trusted Web Activities both require it.
2. **Publish the privacy policy** at a public URL. Use `docs/PRIVACY.md`, after filling in the contact details.
3. **Create app icons** in the sizes each store requires. `public/icons/` has the PWA icons; stores may need more.
4. **Set the app name, version, and listing text.** Keep the claims accurate to what the app does.

## Google Play (Trusted Web Activity)

1. Install Bubblewrap: `npm i -g @bubblewrap/cli`.
2. Run `bubblewrap init --manifest https://YOUR-DOMAIN/manifest.webmanifest` and follow the prompts.
3. Create a signing key. Keep it safe: losing it means you cannot update the app.
4. Host the `assetlinks.json` file that Bubblewrap generates at `https://YOUR-DOMAIN/.well-known/assetlinks.json`.
5. Build the `.aab` with `bubblewrap build` and upload it in Play Console.

## Apple App Store (Capacitor)

1. Add Capacitor: `npm i @capacitor/core @capacitor/cli @capacitor/ios` and run `npx cap add ios`.
2. Point the web view at your hosted URL, or bundle `dist/` into the iOS project.
3. Open the project in Xcode on a Mac, set your team and bundle ID, and archive the app.
4. Upload with Xcode and submit in App Store Connect.

## Voice input on iPhone

Safari supports speech recognition on iOS, but the first use asks for microphone permission. Test on a real device before submitting.

## Not included yet

- Payments or subscriptions. The app is free and local. If you sell it, add a store purchase or a payment provider, which needs its own review.
- Sync between devices. Data stays on one device until a sync feature is added.
