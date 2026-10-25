// Small, dependency-free string helpers.

const GERMAN = { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss" };

// Turns a title into a URL slug: lower-case ASCII letters and digits
// joined by single hyphens, e.g. "Größe & Maß!" -> "groesse-mass".
export function slugify(text) {
  if (typeof text !== "string") {
    throw new TypeError(`slugify expects a string, got ${typeof text}`);
  }
  return text
    .normalize("NFC") // compose "u" + U+0308 into "ü" before mapping
    .toLowerCase() // also maps Ä/Ö/Ü and capital ẞ
    .trim()
    .replace(/[äöüß]/g, (c) => GERMAN[c])
    .normalize("NFKD") // "é" -> "e" + combining accent, stripped below
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
