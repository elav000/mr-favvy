# Chrome Web Store listing copy

Text to paste into the chrome.google.com/webstore/devconsole submission form. Keep this in sync with the actual extension behavior.

CWS rendering note: the description field does **not** support Markdown. Line breaks render, but `**bold**` and `#` headings render as literal characters. Sections below use ALL-CAPS labels so they remain readable when pasted as plain text.

## Name

> 50-character limit. Provided by `_locales/en/messages.json` (`extName`).

```
Mr. Favvy
```

## Summary

> 132-character limit. Current: 129 chars.

```
Replace any website's favicon with an emoji you choose. Add a URL pattern and an emoji — every matching tab gets it. No tracking.
```

## Description

> 16,000-character limit. Paste as plain text — CWS does not render Markdown.

```
Mr. Favvy replaces the favicon of websites you choose with an emoji. Tell apart your tabs at a glance: give your issue tracker a 🔥, your staging environment a 🚧, and your bank a 💰.

HOW IT WORKS

Open the popup on any site, type a URL pattern and paste an emoji, and every tab whose URL matches gets that emoji as its favicon — applied instantly to already-open tabs, and kept in place even on sites that swap their own favicon dynamically (SPAs, notification counters, and the like). Delete the rule and the original favicon comes right back.

PATTERNS

• example.com — matches the site and all its subdomains
• *.example.com — wildcard subdomain match
• example.com/path — matches that path and everything under it
• * works as a wildcard anywhere; the first matching rule wins

FEATURES

• One-click setup. The pattern field is prefilled with the current site's hostname — just add an emoji.

• Sharp at every size. Emoji favicons are generated as crisp SVGs on your device, rendered by your own system's emoji font. No images are downloaded.

• Survives dynamic favicons. Sites that change their favicon at runtime (SPAs, unread-count badges) can't override your emoji.

• Synced rules. Rules live in your browser's extension sync storage, so they follow your profile across devices.

• Minimal permissions. Just storage and activeTab — no tabs permission, no browsing-history access.

PRIVACY

Mr. Favvy makes zero network requests. No analytics, no telemetry, no remote code, no favicon services. Your rules are stored in your browser's extension sync storage; page URLs are compared against your patterns locally and never leave the page.

Full privacy policy: https://github.com/nx-alejandrolacasa/mr-favvy/blob/main/PRIVACY.md

SOURCE AND LICENSE

Open source under the MIT License.

GitHub: https://github.com/nx-alejandrolacasa/mr-favvy
```

## Category

> CWS allows one primary category.

- **Functionality & UI** (primary recommendation — browser-chrome/tab customization)
- Fallback: **Tools**

## Language

```
English (United States)
```

## Store icon

`packages/shared/assets/icons/icon.png` (128×128 PNG) — already embedded in the package, also uploaded separately as the store-listing icon.

## Screenshots

CWS requires **exactly 1280×800** or **640×400**. At least one screenshot is required; up to five may be uploaded.

**Not captured yet.** Suggested shots (save to `packages/shared/assets/screenshots/` at 1280×800):

1. A tab strip with several emoji favicons applied (the money shot — shows the point instantly)
2. The popup open with the prefilled pattern field and a few rules in the list
3. Before/after of the same pinned tabs with and without Mr. Favvy

## Promotional images (optional but recommended)

- **Small promo tile**: 440×280 PNG/JPG — improves visibility in CWS rotations.
- **Marquee promo**: 1400×560 PNG/JPG — only used if the extension is featured.

If we don't have these yet, skip them; they can be added in a later edit without re-review.

## Release notes

> CWS shows version notes on the item's update. Paste the latest entry as plain text. Newest first.

### v1.1.0

```
Favimoji is now Mr. Favvy, joining Mr. Pinny, Mr. Newtabby and Mr. Clicky. Same extension, new name: your rules are kept and everything works exactly as before. Still zero network requests.
```

### v1.0.0

```
First release. Add a URL pattern and an emoji in the popup, and every matching tab gets that emoji as its favicon — applied live, resilient to sites that swap their own favicon, with originals restored when you delete a rule. Rules sync with your browser profile. Zero network requests.
```
