// Rule model, persistence (storage.sync), and URL-pattern matching.
//
// A rule maps a URL pattern to an emoji. Patterns are matched against the
// page URL with these semantics:
//   - "github.com"        → that host and any subdomain (www.github.com, …)
//   - "*.github.com"      → wildcard host match
//   - "github.com/vercel" → host + path prefix (matches /vercel and /vercel/…)
//   - "*" matches any run of characters anywhere in the pattern
// The first rule (in list order) that matches wins.

export interface Rule {
  id: string;
  pattern: string;
  emoji: string;
}

const STORAGE_KEY = "rules";

// Firefox supports the promise-based `chrome.*` namespace too, so `chrome`
// works as the single entry point on both browsers.
function storage(): chrome.storage.SyncStorageArea {
  return chrome.storage.sync;
}

export async function loadRules(): Promise<Rule[]> {
  const data = await storage().get(STORAGE_KEY);
  const raw = data[STORAGE_KEY];
  if (!Array.isArray(raw)) return [];
  return raw.filter(isRule);
}

export async function saveRules(rules: Rule[]): Promise<void> {
  await storage().set({ [STORAGE_KEY]: rules });
}

export function onRulesChanged(listener: (rules: Rule[]) => void): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !(STORAGE_KEY in changes)) return;
    const raw = changes[STORAGE_KEY]?.newValue;
    listener(Array.isArray(raw) ? raw.filter(isRule) : []);
  });
}

export function newRuleId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isRule(value: unknown): value is Rule {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.pattern === "string" &&
    typeof v.emoji === "string" &&
    v.pattern.length > 0 &&
    v.emoji.length > 0
  );
}

export function findMatch(rules: readonly Rule[], url: string): Rule | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  return rules.find((rule) => matchesPattern(parsed, rule.pattern)) ?? null;
}

export function matchesPattern(url: URL, pattern: string): boolean {
  const p = normalizePattern(pattern);
  if (!p) return false;

  const host = url.hostname.toLowerCase();
  if (!p.includes("/")) {
    if (p.includes("*")) return wildcardRegExp(p).test(host);
    return host === p || host.endsWith(`.${p}`);
  }

  // Host+path pattern: prefix match on a path-segment boundary, so
  // "github.com/vercel" matches /vercel and /vercel/next.js but not /vercelx.
  // "www." is stripped from both sides (see normalizePattern).
  const bareHost = host.replace(/^www\./, "");
  const target = (bareHost + url.pathname).replace(/\/+$/, "");
  const prefix = p.replace(/\/+$/, "");
  if (prefix.includes("*")) return wildcardRegExp(prefix, true).test(target);
  return target === prefix || target.startsWith(`${prefix}/`);
}

function normalizePattern(pattern: string): string {
  return pattern
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\.(?=.)/, "");
}

function wildcardRegExp(pattern: string, allowPathSuffix = false): RegExp {
  const escaped = pattern
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${escaped}${allowPathSuffix ? "(?:/.*)?" : ""}$`);
}
