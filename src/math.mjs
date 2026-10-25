// Small reusable math helpers.

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new RangeError("divide: division by zero (b must not be 0)");
  }
  return a / b;
}
