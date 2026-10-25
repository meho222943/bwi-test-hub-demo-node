import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/strings.mjs";

test("slugify lower-cases and hyphenates normal text", () => {
  assert.equal(slugify("Hello World"), "hello-world");
  assert.equal(slugify("  Release 2 Notes  "), "release-2-notes");
});

test("slugify transliterates German umlauts and ß", () => {
  assert.equal(slugify("Über Größe und Maß"), "ueber-groesse-und-mass");
  assert.equal(slugify("ÄRGER ÖL"), "aerger-oel");
  assert.equal(slugify("Mu\u0308ller"), "mueller"); // decomposed ü
});

test("slugify collapses runs of spaces and punctuation", () => {
  assert.equal(slugify("Hello,   World!!!"), "hello-world");
  assert.equal(slugify("a -- b ... c"), "a-b-c");
  assert.equal(slugify("foo_bar/baz?qux"), "foo-bar-baz-qux");
});

test("slugify strips leading and trailing hyphens", () => {
  assert.equal(slugify("--- Hello ---"), "hello");
  assert.equal(slugify("!!!Hi?"), "hi");
});

test("slugify returns an empty string for empty or punctuation-only input", () => {
  assert.equal(slugify(""), "");
  assert.equal(slugify("   "), "");
  assert.equal(slugify("?!-"), "");
});

test("slugify rejects non-string input", () => {
  assert.throws(() => slugify(undefined), TypeError);
});
