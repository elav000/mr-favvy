// Popup UI: list rules, add a rule (pattern prefilled from the active tab),
// delete rules. All persistence goes through storage.sync so the content
// scripts pick changes up live via storage.onChanged.

import { loadRules, saveRules, newRuleId, type Rule } from "./rules";
import { emojiFaviconUrl, firstEmoji } from "./emoji-favicon";

let rules: Rule[] = [];

export async function runPopup(): Promise<void> {
  localize();
  rules = await loadRules();
  renderList();

  const form = byId<HTMLFormElement>("add-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void addRule();
  });

  await prefillPattern();
}

async function addRule(): Promise<void> {
  const patternInput = byId<HTMLInputElement>("pattern-input");
  const emojiInput = byId<HTMLInputElement>("emoji-input");

  const pattern = patternInput.value.trim();
  const emoji = firstEmoji(emojiInput.value);
  if (!pattern || !emoji) return;

  const existing = rules.find(
    (rule) => rule.pattern.toLowerCase() === pattern.toLowerCase()
  );
  if (existing) {
    existing.emoji = emoji;
  } else {
    rules.push({ id: newRuleId(), pattern, emoji });
  }
  await saveRules(rules);

  emojiInput.value = "";
  renderList();
}

async function deleteRule(id: string): Promise<void> {
  rules = rules.filter((rule) => rule.id !== id);
  await saveRules(rules);
  renderList();
}

function renderList(): void {
  const list = byId<HTMLUListElement>("rule-list");
  const empty = byId<HTMLParagraphElement>("empty-state");
  list.replaceChildren();
  empty.hidden = rules.length > 0;

  for (const rule of rules) {
    const item = document.createElement("li");
    item.className = "rule";

    const icon = document.createElement("img");
    icon.className = "rule-icon";
    icon.alt = rule.emoji;
    icon.src = emojiFaviconUrl(rule.emoji);

    const pattern = document.createElement("span");
    pattern.className = "rule-pattern";
    pattern.textContent = rule.pattern;
    pattern.title = rule.pattern;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "rule-delete";
    remove.textContent = "×";
    remove.setAttribute("aria-label", msg("deleteRule"));
    remove.title = msg("deleteRule");
    remove.addEventListener("click", () => void deleteRule(rule.id));

    item.append(icon, pattern, remove);
    list.append(item);
  }
}

// activeTab is granted when the popup opens, so tab.url is readable without
// the broader "tabs" permission.
async function prefillPattern(): Promise<void> {
  const patternInput = byId<HTMLInputElement>("pattern-input");
  if (patternInput.value) return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return;
    const url = new URL(tab.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    patternInput.value = url.hostname.replace(/^www\./, "");
  } catch {
    // Leave the field empty if the URL is unavailable.
  }
}

function localize(): void {
  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const key = el.dataset.i18n;
    if (key) el.textContent = msg(key);
  }
  for (const el of document.querySelectorAll<HTMLInputElement>(
    "[data-i18n-placeholder]"
  )) {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = msg(key);
  }
}

function msg(key: string): string {
  return chrome.i18n.getMessage(key) || key;
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}
