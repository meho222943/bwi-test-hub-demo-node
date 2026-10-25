import { test } from "node:test";
import assert from "node:assert/strict";
import { clamp } from "../src/clamp.mjs";

test("clamp raises values below the range to min", () => {
  assert.equal(clamp(-5, 0, 10), 0);
});

test("clamp keeps values inside the range", () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(0, 0, 10), 0);
  assert.equal(clamp(10, 0, 10), 10);
});

test("clamp lowers values above the range to max", () => {
  assert.equal(clamp(15, 0, 10), 10);
});

test("clamp throws a RangeError when min > max", () => {
  assert.throws(() => clamp(5, 10, 0), RangeError);
});
