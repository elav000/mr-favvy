// Logic smoke tests for pattern matching and emoji helpers.
// Run via:  npm test   (plain node, relies on native TS type stripping)
import assert from "node:assert";
import { matchesPattern, findMatch } from "../packages/shared/src/rules.ts";
import { emojiFaviconUrl, firstEmoji } from "../packages/shared/src/emoji-favicon.ts";

const m = (url, pattern) => matchesPattern(new URL(url), pattern);

// host patterns
assert(m("https://github.com/foo", "github.com"));
assert(m("https://www.github.com/", "github.com"));
assert(m("https://gist.github.com/", "github.com"));
assert(!m("https://notgithub.com/", "github.com"));
assert(m("https://github.com/", "https://github.com"));
assert(m("https://github.com/", "www.github.com"));

// port-specific host patterns
assert(m("http://host.local:5001/", "host.local:5001"));
assert(!m("http://host.local:5002/", "host.local:5001"));
assert(!m("http://host.local/", "host.local:5001"));
assert(m("http://host.local:5002/", "host.local"));
assert(m("http://host.local:5001/app", "host.local:5001/app"));
assert(!m("http://host.local:5002/app", "host.local:5001/app"));

const nasRules = [
  { id: "host-1", pattern: "host.local:5001", emoji: "💾" },
  { id: "host-2", pattern: "host.local:5002", emoji: "📺" },
];
assert.equal(findMatch(nasRules, "http://host.local:5001/")?.emoji, "💾");
assert.equal(findMatch(nasRules, "http://host.local:5002/")?.emoji, "📺");

// wildcard host
assert(m("https://gist.github.com/", "*.github.com"));
assert(!m("https://github.com/", "*.github.com"));
assert(m("https://mail.google.com/", "mail.*"));

// host+path patterns
assert(m("https://github.com/vercel", "github.com/vercel"));
assert(m("https://github.com/vercel/next.js", "github.com/vercel"));
assert(!m("https://github.com/vercelx", "github.com/vercel"));
assert(m("https://github.com/vercel/", "github.com/vercel/"));
assert(m("https://www.github.com/vercel", "github.com/vercel"));
assert(m("https://github.com/a/b", "github.com/*/b"));

// rule list resolution, non-http schemes, and garbage input
const rules = [
  { id: "1", pattern: "github.com", emoji: "🐙" },
  { id: "2", pattern: "*.google.com", emoji: "🔍" },
];
assert.equal(findMatch(rules, "https://github.com/x")?.emoji, "🐙");
assert.equal(findMatch(rules, "https://docs.google.com/")?.emoji, "🔍");
assert.equal(findMatch(rules, "https://example.com/"), null);
assert.equal(findMatch(rules, "chrome://settings"), null);
assert.equal(findMatch(rules, "not a url"), null);

// emoji helpers
assert.equal(firstEmoji("  🇪🇸 extra"), "🇪🇸");
assert.equal(firstEmoji("👨‍👩‍👧‍👦abc"), "👨‍👩‍👧‍👦");
assert.equal(firstEmoji("   "), "");
assert(emojiFaviconUrl("🐙").startsWith("data:image/svg+xml,"));
assert(!decodeURIComponent(emojiFaviconUrl('"<&>"')).includes("<&"));

console.log("all rules tests passed");
