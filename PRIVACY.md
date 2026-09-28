# Privacy Policy

**Last updated:** 2026-07-14

This policy explains what data the **Mr. Favvy** browser extension (the "extension") handles, what is transmitted off your device, and how you can control it. It applies to the version of the extension distributed via [addons.mozilla.org](https://addons.mozilla.org) (Firefox) and the [Chrome Web Store](https://chromewebstore.google.com) (Chrome and Chromium-based browsers), and any source-built copy of the same code.

## 1. Summary

- The extension replaces the favicon of websites you choose with an emoji, based on URL patterns you define.
- The extension makes **no network requests at all**. Emoji favicons are generated locally as inline SVG images.
- The extension does **not** collect, transmit, sell, or share your browsing history, page contents, or any personal identifier.
- Your rules (URL pattern + emoji pairs) are stored in your browser's extension **sync storage**, which your browser may synchronize across your own devices when you are signed in to browser sync. That synchronization is performed entirely by your browser vendor (Mozilla or Google) under their privacy policies — the developer never receives or can access this data.

## 2. Data the extension does not collect or transmit

The extension does **not**:

- Make any outbound network request. There is no server component, no API, no CDN, no font or icon service.
- Transmit your browsing history, visited URLs, page contents, or any personal identifier — to the developer or to anyone else.
- Use analytics, telemetry, crash reporting, or any user-identification mechanism.
- Use cookies or any tracking technology.
- Sell, rent, lease, share, or disclose data to advertisers, data brokers, or any third party.
- Read or modify page content beyond the favicon `<link>` elements in the page's `<head>`.
- Modify your bookmarks, history, settings, or any other browser data.

## 3. Data stored by the extension

The extension stores exactly one kind of data: **your rules** — the list of URL pattern + emoji pairs you create in the popup. Each rule contains the pattern text you typed, the emoji you picked, and a random internal ID.

Rules are stored in your browser's extension sync storage (`storage.sync`):

- On your device, always.
- Across your devices, only if you are signed in to your browser's sync feature (Firefox Sync / Chrome sync). That replication is performed by your browser vendor as part of normal extension-storage sync; the developer has no server and no access to it.

Deleting a rule in the popup removes it immediately. Uninstalling the extension removes all of its stored data.

## 4. How the extension processes page URLs

To decide whether a tab should get an emoji favicon, the extension's content script compares the **current page's URL against your rules, locally, in the page itself**. The URL is used only for this comparison; it is never stored, logged, or transmitted. When a rule matches, the content script swaps the page's favicon `<link>` element for a locally generated SVG data URL containing your emoji — no image is fetched from anywhere.

The popup also reads the **active tab's URL** (via the `activeTab` permission, granted when you open the popup) solely to prefill the pattern field with the site's hostname as a convenience. It is not stored or transmitted.

## 5. Permissions

| Permission | Why it is needed |
|---|---|
| `storage` | Persist your rules in `storage.sync` so they survive restarts and follow your browser profile. |
| `activeTab` | Read the current tab's URL when you open the popup, to prefill the pattern field with the site's hostname. |
| Content script on `http://*/*` and `https://*/*` | The extension must be able to swap the favicon on whichever sites *you* write rules for. Because patterns are defined by you at runtime, the match list cannot be narrowed in advance. The content script only compares the page URL against your rules and modifies favicon `<link>` elements; it does not read or alter page content. |

## 6. Legal basis for processing (EU/EEA users)

Where the General Data Protection Regulation (GDPR) applies: the extension processes no personal data on any server — all processing described above happens locally on your device at your direction. Synchronization of your rules across devices, if any, is performed by your browser vendor under their own legal basis and privacy policy.

## 7. Your rights and how to exercise them

- **Delete individual rules**: open the popup and remove them.
- **Delete all local data**: uninstall the extension; your browser removes its storage automatically.
- **Stop cross-device sync**: sign out of browser sync or disable extension-data sync in your browser's settings.
- **Right to access, rectification, erasure, restriction, portability, and objection** (GDPR), and **right to know, delete, and opt-out of "sale" or sharing** (CCPA / California): the developer stores no data about you anywhere. Everything the extension generates is on your device (and, via your browser's sync, your other devices) and fully under your control. The developer does not sell or share data, so there is nothing to opt out of.

## 8. Children's privacy

The extension is not directed at children under the age of 13 and does not knowingly collect personal information from anyone, including children.

## 9. Security

The extension contains no remotely loaded code, no eval'd code, and no third-party scripts. Locally stored data is protected by the same operating-system-level access controls that protect your browser profile.

## 10. Changes to this policy

If the extension's data practices change, this policy will be updated and the "Last updated" date at the top will reflect the change. Material changes will also be noted in the extension's release notes on addons.mozilla.org and the Chrome Web Store.
