# Firefox listing copy

Text to paste into the addons.mozilla.org submission form. Keep this in sync with the actual extension behavior.

## Summary

> 250-character limit. Current: 247 chars.

```
Replace any website's favicon with an emoji of your choice. Add a URL pattern and an emoji in the popup, and every matching tab shows that emoji as its favicon — applied instantly, synced across your devices, no tracking, no analytics, no network.
```

## Description

> Markdown is supported (basic). Paste into the AMO description field.

```markdown
**Favimoji** replaces the favicon of websites you choose with an emoji. Tell apart your tabs at a glance: give your issue tracker a 🔥, your staging environment a 🚧, and your bank a 💰.

**How it works**

Open the popup on any site, type a URL pattern and paste an emoji, and every tab whose URL matches gets that emoji as its favicon — applied instantly to already-open tabs, and kept in place even on sites that swap their own favicon dynamically (SPAs, notification counters, and the like). Delete the rule and the original favicon comes right back.

**Patterns**

- `example.com` — matches the site and all its subdomains
- `*.example.com` — wildcard subdomain match
- `example.com/path` — matches that path and everything under it
- `*` works as a wildcard anywhere; the first matching rule wins

**Features**

- **One-click setup.** The pattern field is prefilled with the current site's hostname — just add an emoji.
- **Sharp at every size.** Emoji favicons are generated as crisp SVGs on your device, rendered by your own system's emoji font. No images are downloaded.
- **Survives dynamic favicons.** Sites that change their favicon at runtime (SPAs, unread-count badges) can't override your emoji.
- **Synced rules.** Rules live in your browser's extension sync storage, so they follow your Firefox profile across devices.
- **Minimal permissions.** Just `storage` and `activeTab` — no `tabs` permission, no browsing-history access.

**Privacy**

Favimoji makes **zero network requests**. No analytics, no telemetry, no remote code, no favicon services. Your rules are stored in your browser's extension sync storage; page URLs are compared against your patterns locally and never leave the page.

Full privacy policy: https://github.com/nx-alejandrolacasa/favimoji/blob/main/PRIVACY.md

**Source & license**

Open source under the MIT License.

GitHub: https://github.com/nx-alejandrolacasa/favimoji
```

## Categories

- Appearance
- Tabs

## Tags

`favicon`, `emoji`, `tabs`, `customization`, `minimal`

## Notes for reviewer

> Paste into AMO's "Notes for reviewer" field on submission.

```
Favimoji lets the user map URL patterns to emojis; a content script
swaps the favicon <link> elements for a locally generated SVG data URL
on pages whose URL matches one of the user's rules.

The content script matches <all http/https urls> because the sites it
must act on are chosen by the user at runtime (their rules), so the
match list cannot be narrowed statically. On pages with no matching
rule the script only reads location.href, compares it against the
stored rules, and does nothing else. It never reads or modifies page
content beyond link[rel~=icon] elements in <head>, and it makes no
network requests (the extension has no host permissions and zero
outbound traffic).

Rules (pattern + emoji pairs) are stored in storage.sync. The popup
uses activeTab only to prefill the pattern field with the current
tab's hostname.

A MutationObserver re-applies the emoji favicon if the page swaps its
own favicon (SPAs, unread-count badges) and re-evaluates rules on
SPA navigations; storage.onChanged applies rule changes live and
restores the original favicon when a rule is deleted.

Build: npm install && npm run build (esbuild monorepo; see README).
No analytics, telemetry, or crash reporting. No remote code. No .env
or secrets involved in the build.

To test:
1. Install the extension, open any http(s) site.
2. Click the toolbar icon — the pattern field is prefilled with the
   site's hostname. Paste an emoji and click Add.
3. The tab's favicon changes immediately; reloading keeps it.
4. Delete the rule in the popup — the original favicon is restored
   without a reload.
```

## Source code submission

> AMO asks "Do you use any of the following in your extension?" — answer **Yes** (esbuild bundles multiple files into one). Upload a source zip generated from the release tag: `git archive --format=zip -o web-ext-artifacts/favimoji-<version>-source.zip v<version>`. Paste the following into the source-submission notes field:

```
Requirements: Node.js 22.x (ships with npm 10). Any OS.

1. Unzip the source archive and cd into it.
2. npm install
3. npm run build

The Firefox package is produced at packages/firefox/dist/ and matches
the uploaded zip: esbuild IIFE bundles, unminified, with inline source
maps. No env vars, secrets, or code generation are involved — the
build is a plain esbuild bundle plus static asset copies.
```

## Release notes

> Paste the latest entry into the version's "Release notes" / "What's new" field. Newest first.

### v1.0.0

```
First release. Add a URL pattern and an emoji in the popup, and every matching tab gets that emoji as its favicon — applied live, resilient to sites that swap their own favicon, with originals restored when you delete a rule. Rules sync with your Firefox profile. Zero network requests.
```
