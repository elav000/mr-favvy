# Mr. Favvy

Browser extension (Chrome + Firefox, Manifest V3) that replaces website
favicons with an emoji of your choice, based on URL patterns.

Open the popup, add a pattern and an emoji, and every tab whose URL matches
gets that emoji as its favicon — applied live, and kept in place even when
the site swaps its own icon dynamically.

Formerly **Favimoji** (renamed in v1.1.0). The Firefox add-on ID
(`favimoji@nx-alejandrolacasa.github.io`) is intentionally unchanged so
existing installs keep updating.

## Pattern syntax

| Pattern              | Matches                                          |
| -------------------- | ------------------------------------------------ |
| `github.com`         | `github.com` and any subdomain                   |
| `*.github.com`       | subdomains of `github.com` (wildcard host)       |
| `github.com/vercel`  | that path and anything under it                  |
| `*`                  | any run of characters, anywhere in the pattern   |

The first matching rule (in list order) wins. Rules sync via
`storage.sync`, so they follow your browser profile.

## Repo layout

npm-workspaces monorepo, same shape as [topmarks](../topmarks):

- `packages/shared` — browser-agnostic logic (rules + matching, favicon
  rendering, content script, popup UI), assets, and locales.
- `packages/chrome` — Chrome manifest + esbuild script → `dist/`.
- `packages/firefox` — Firefox manifest + esbuild script → `dist/`.

## Development

```sh
npm install
npm run build            # both browsers → packages/*/dist/
npm run dev:chrome       # watch + web-ext run (Chromium)
npm run dev:firefox      # watch + web-ext run (Firefox)
npm run typecheck
npm test                 # pattern-matching smoke tests
npm run lint             # web-ext lint (firefox dist)
```

Load `packages/chrome/dist` via `chrome://extensions` → “Load unpacked”, or
`packages/firefox/dist` via `about:debugging` → “Load Temporary Add-on”.

The Chrome icon PNG is generated from the SVG design with
`node scripts/generate-icon.mjs`.
