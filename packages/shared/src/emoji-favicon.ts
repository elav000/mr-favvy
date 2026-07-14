// Render an emoji as an SVG favicon data URL. SVG keeps it crisp at every
// size and needs no canvas work; both Chrome and Firefox accept SVG favicons.

export function emojiFaviconUrl(emoji: string): string {
  // font-size equals the viewBox so the glyph fills the icon; emoji fonts
  // leave a little padding inside the em box, so nothing clips.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<text x="32" y="34" font-size="64" text-anchor="middle" ` +
    `dominant-baseline="central">${escapeXml(emoji)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Keep only the first grapheme so multi-character input can't distort the icon.
export function firstEmoji(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const first = segmenter.segment(trimmed)[Symbol.iterator]().next();
  return first.done ? "" : first.value.segment;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
