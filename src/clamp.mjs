// Restricts value to the inclusive range [min, max].
export function clamp(value, min, max) {
  if (min > max) {
    throw new RangeError(`clamp: min (${min}) must not be greater than max (${max})`);
  }
  return Math.min(Math.max(value, min), max);
}
