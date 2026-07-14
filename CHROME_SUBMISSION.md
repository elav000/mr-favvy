# Chrome Web Store submission — dashboard form fields

Text to paste into the **Privacy** and **Distribution** tabs of the chrome.google.com/webstore/devconsole submission form, in addition to the listing copy in [`LISTING_CHROME.md`](./LISTING_CHROME.md).

## Single purpose

> One sentence. CWS reviewers check that every permission ties back to this.

```
Replace the favicon of websites the user chooses with an emoji, based on URL patterns the user defines in the extension's popup.
```

## Permission justifications

Paste one line per permission into the corresponding field in the dashboard. Each line answers "Why does your extension need this permission?"

### `storage`

```
Persists the user's rules — the URL pattern + emoji pairs created in the popup — in chrome.storage.sync so they survive restarts and follow the user's browser profile. This is the only data the extension stores. Nothing is transmitted to the developer; storage.sync replication across the user's own devices is performed by Chrome itself.
```

### `activeTab`

```
Used only when the user opens the popup: reads the active tab's URL to prefill the pattern field with the current site's hostname as a convenience. The URL is not stored or transmitted. The broader "tabs" permission is deliberately not requested.
```

### Content script on `http://*/*` and `https://*/*`

```
The extension's sole function is to swap the favicon on whichever sites the user writes rules for. Because rules are created by the user at runtime (any URL pattern), the content-script match list cannot be narrowed statically. On pages with no matching rule, the script only compares location.href against the stored rules locally and does nothing. It never reads or modifies page content beyond the favicon link elements in <head>, and it makes no network requests — the emoji favicon is generated in-page as an SVG data URL. The extension requests no host permissions and has zero outbound traffic.
```

## Remote code

> CWS field: "Are you using remote code?" — Choose **No**.

```
No. All JavaScript executed by the extension is bundled inside the package at build time (esbuild, IIFE bundles). No eval, no Function() construction from strings, no script injection from remote sources, no WebAssembly. The extension makes no network requests at all; emoji favicons are inline SVG data URLs generated locally.
```

## Data usage disclosure

> CWS field: "What user data does your extension collect or use?" — Favimoji transmits nothing. The content script *reads* the page URL locally to match it against the user's rules, which Google may classify as **"Web history"-adjacent or "Website content"** under the conservative reading. Decision to confirm before submitting: with nothing collected, logged, or transmitted, all categories can defensibly be left unchecked; if you prefer the conservative reading, tick **Website content** (the page URL is read in-page) and rely on the certifications below. Either way the rationale below applies.

Rationale for the reviewer (paste in the "Additional details" field if prompted):

```
Favimoji does not collect or transmit any user data. It has no server,
no host permissions, and makes zero network requests. The content
script reads the current page's URL in-page, solely to compare it
against the user's own pattern rules; the URL is never stored, logged,
or transmitted. The only stored data is the user's rules (URL pattern +
emoji pairs), kept in chrome.storage.sync — replicated across the
user's own devices by Chrome itself, never visible to the developer.
No analytics, telemetry, or crash reporting.
```

## Data usage certifications

> CWS displays three required checkboxes near the data-usage form. Tick all three:

- [x] **I do not sell or transfer user data to third parties** apart from the approved use cases.
- [x] **I do not use or transfer user data for purposes unrelated to my item's single purpose.**
- [x] **I do not use or transfer user data to determine creditworthiness or for lending purposes.**

## Privacy policy URL

```
https://github.com/nx-alejandrolacasa/favimoji/blob/main/PRIVACY.md
```

## Notes for reviewer

> Paste into the "Justification" / "Testing instructions" field on submission.

```
Favimoji replaces the favicon of sites the user chooses with an emoji,
based on URL patterns defined in the popup.

To test:
1. Install the unpacked extension or the uploaded package.
2. Open any http(s) site and click the toolbar icon — the pattern
   field is prefilled with the site's hostname.
3. Paste an emoji (e.g. 🐙) and click Add. The tab's favicon changes
   immediately; reloading keeps it, and sites that swap their own
   favicon dynamically cannot override it.
4. Delete the rule in the popup — the original favicon is restored
   without a reload.

Network behavior: none. The extension makes zero network requests;
emoji favicons are generated in-page as SVG data URLs. The broad
content-script match (http/https) exists only because the affected
sites are chosen by the user at runtime via their rules.

Build notes:
- Source: https://github.com/nx-alejandrolacasa/favimoji (MIT license)
- npm install && npm run build reproduces the package (esbuild
  monorepo, no env vars or secrets).
- No analytics, telemetry, crash reporting, or remote code.
```

## Distribution settings

- **Visibility**: Public
- **Distribution**: All regions (the extension has no region-specific behavior)
- **Pricing**: Free

## Post-submission checklist

- [ ] Listing language matches `LISTING_CHROME.md` (summary ≤ 132 chars, description pasted as plain text)
- [ ] Privacy practices tab green-checked (all three certifications ticked, privacy policy URL present)
- [ ] Single purpose statement matches the one above
- [ ] Justifications filled for `storage`, `activeTab`, and the content-script host access
- [ ] Screenshots uploaded (1280×800 or 640×400, at least one — see LISTING_CHROME.md, none captured yet)
- [ ] Store icon = 128×128 PNG (auto-uses `icons.128` from manifest, but the listing slot is separate — upload `packages/shared/assets/icons/icon.png` there too)
- [ ] Package uploaded: `packages/chrome/web-ext-artifacts/favimoji-chrome-v1.0.0.zip`
