import { test } from "node:test";
import assert from "node:assert/strict";
import { add, unique } from "../src/helpers.mjs";

test("addition", () => {
  assert.equal(add(2, 2), 4);
});

test("addition with negatives", () => {
  assert.equal(add(-3, 1), -2);
});

test("unique removes duplicates", () => {
  assert.deepEqual(unique([1, 1, 2, 3, 3]), [1, 2, 3]);
});

test("unique preserves order", () => {
  assert.deepEqual(unique(["b", "a", "b"]), ["b", "a"]);
});
