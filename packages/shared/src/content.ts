// Content script: swap the page favicon for the emoji of the first matching
// rule, keep it applied when the page swaps icons itself (SPAs, dynamic
// favicons), and restore the original icons when rules change or stop
// matching.

import { findMatch, loadRules, onRulesChanged, type Rule } from "./rules";
import { emojiFaviconUrl } from "./emoji-favicon";

const MARKER = "data-favimoji";

let rules: Rule[] = [];
let activeEmoji: string | null = null;
let removedOriginals: HTMLLinkElement[] = [];
let lastHref = "";
let evaluateScheduled = false;

export async function runContent(): Promise<void> {
  rules = await loadRules();
  onRulesChanged((next) => {
    rules = next;
    evaluate();
  });
  observeDocument();
  evaluate();
}

function evaluate(): void {
  lastHref = location.href;
  const match = findMatch(rules, location.href);
  if (match) applyEmoji(match.emoji);
  else restoreOriginals();
}

function applyEmoji(emoji: string): void {
  for (const link of foreignIconLinks()) {
    removedOriginals.push(link);
    link.remove();
  }

  let ours = ourLink();
  if (!ours) {
    ours = document.createElement("link");
    ours.rel = "icon";
    ours.type = "image/svg+xml";
    ours.setAttribute(MARKER, "");
    iconParent().append(ours);
  }
  const href = emojiFaviconUrl(emoji);
  if (ours.getAttribute("href") !== href) ours.setAttribute("href", href);
  activeEmoji = emoji;
}

function restoreOriginals(): void {
  if (activeEmoji === null && !ourLink()) return;
  ourLink()?.remove();
  for (const link of removedOriginals) {
    if (!link.isConnected) iconParent().append(link);
  }
  removedOriginals = [];
  activeEmoji = null;
}

// The observer watches the whole document so it survives <head> replacement
// and catches SPA navigations (URL changes almost always come with DOM
// mutations). It converges: once our icon is in place with the right href,
// re-running evaluate() causes no further mutations.
function observeDocument(): void {
  const observer = new MutationObserver((records) => {
    const urlChanged = location.href !== lastHref;
    if (!urlChanged && activeEmoji === null) return;
    if (!urlChanged && !records.some(concernsIconLink)) return;
    scheduleEvaluate();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href", "rel"],
  });
}

function scheduleEvaluate(): void {
  if (evaluateScheduled) return;
  evaluateScheduled = true;
  queueMicrotask(() => {
    evaluateScheduled = false;
    evaluate();
  });
}

function concernsIconLink(record: MutationRecord): boolean {
  if (record.type === "attributes") {
    return isIconLink(record.target) && !isUpToDateOwnLink(record.target);
  }
  for (const node of [...record.addedNodes, ...record.removedNodes]) {
    if (node instanceof HTMLLinkElement) {
      if (node.hasAttribute(MARKER)) {
        if (!isUpToDateOwnLink(node)) return true;
      } else if (isIconLink(node)) {
        return true;
      }
    }
  }
  return false;
}

function isUpToDateOwnLink(node: Node): boolean {
  if (!(node instanceof HTMLLinkElement) || !node.hasAttribute(MARKER)) {
    return false;
  }
  return (
    node.isConnected &&
    activeEmoji !== null &&
    node.getAttribute("href") === emojiFaviconUrl(activeEmoji)
  );
}

function isIconLink(node: Node): node is HTMLLinkElement {
  return (
    node instanceof HTMLLinkElement &&
    node.relList != null &&
    (node.relList.contains("icon") || node.relList.contains("shortcut"))
  );
}

function ourLink(): HTMLLinkElement | null {
  return document.querySelector<HTMLLinkElement>(`link[${MARKER}]`);
}

function foreignIconLinks(): HTMLLinkElement[] {
  return [
    ...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
  ].filter((link) => !link.hasAttribute(MARKER));
}

function iconParent(): HTMLElement {
  return document.head ?? document.documentElement;
}
