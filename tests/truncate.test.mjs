import { test } from "node:test";
import assert from "node:assert/strict";
import { truncate } from "../src/helpers.mjs";

test("truncate keeps text shorter than max unchanged", () => {
  assert.equal(truncate("abc", 5), "abc");
});

test("truncate keeps text of exactly max characters unchanged", () => {
  assert.equal(truncate("hello", 5), "hello");
});

test("truncate keeps empty text unchanged", () => {
  assert.equal(truncate("", 3), "");
});

test("truncate cuts longer text to max characters ending with …", () => {
  const result = truncate("hello world", 5);
  assert.equal(result, "hell…");
  assert.equal([...result].length, 5);
});

test("truncate with max 1 returns only …", () => {
  assert.equal(truncate("hello", 1), "…");
});

test("truncate does not split surrogate pairs", () => {
  assert.equal(truncate("😀😀😀", 2), "😀…");
});

test("truncate rejects max below 1", () => {
  assert.throws(() => truncate("hello", 0), RangeError);
});
