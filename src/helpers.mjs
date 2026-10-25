export function add(a, b) {
  return a + b;
}

export function unique(arr) {
  return [...new Set(arr)];
}

// Counts Unicode code points, so surrogate pairs (e.g. emoji) are never split.
export function truncate(text, max) {
  if (!Number.isInteger(max) || max < 1) {
    throw new RangeError("max must be a positive integer");
  }
  const chars = [...text];
  if (chars.length <= max) return text;
  return chars.slice(0, max - 1).join("") + "…";
}
