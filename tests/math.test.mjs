import { test } from "node:test";
import assert from "node:assert/strict";
import { multiply, divide } from "../src/math.mjs";

test("multiply", () => {
  assert.equal(multiply(3, 4), 12);
});

test("multiply with negatives and zero", () => {
  assert.equal(multiply(-2, 5), -10);
  assert.equal(multiply(7, 0), 0);
});

test("divide", () => {
  assert.equal(divide(12, 4), 3);
  assert.equal(divide(1, 4), 0.25);
});

test("divide with negatives", () => {
  assert.equal(divide(-9, 3), -3);
});

test("divide by zero throws RangeError", () => {
  assert.throws(() => divide(1, 0), {
    name: "RangeError",
    message: "divide: division by zero (b must not be 0)",
  });
});
