import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isRichTextEmpty, sanitizeRichTextHtml } from "./sanitizeHtml";

describe("sanitizeRichTextHtml", () => {
  it("keeps allowed rich-text formatting tags", () => {
    const out = sanitizeRichTextHtml(
      "<p>Hello <strong>world</strong></p><ul><li>one</li></ul>",
    );

    assert.ok(out.includes("<p>Hello <strong>world</strong></p>"));
    assert.ok(out.includes("<ul>"));
    assert.ok(out.includes("<li>one</li>"));
  });

  it("strips script tags and inline event handlers", () => {
    const out = sanitizeRichTextHtml(
      '<p onclick="steal()">hi</p><script>alert(1)</script>',
    );

    assert.ok(!out.includes("<script"));
    assert.ok(!out.includes("onclick"));
    assert.ok(out.includes("hi"));
  });

  it("removes javascript: hrefs but keeps safe links", () => {
    const unsafe = sanitizeRichTextHtml('<a href="javascript:alert(1)">x</a>');
    assert.ok(!unsafe.includes("javascript:"));

    const safe = sanitizeRichTextHtml('<a href="https://rayda.co">Rayda</a>');
    assert.ok(safe.includes('href="https://rayda.co"'));
  });

  it("returns an empty string for nullish input", () => {
    assert.equal(sanitizeRichTextHtml(null), "");
    assert.equal(sanitizeRichTextHtml(undefined), "");
    assert.equal(sanitizeRichTextHtml(""), "");
  });
});

describe("isRichTextEmpty", () => {
  it("treats empty paragraphs and whitespace as empty", () => {
    assert.equal(isRichTextEmpty("<p></p>"), true);
    assert.equal(isRichTextEmpty("<p>&nbsp;</p>"), true);
    assert.equal(isRichTextEmpty("   "), true);
    assert.equal(isRichTextEmpty(null), true);
    assert.equal(isRichTextEmpty(undefined), true);
  });

  it("treats real content as non-empty", () => {
    assert.equal(isRichTextEmpty("<p>Hello</p>"), false);
    assert.equal(isRichTextEmpty("<ul><li>item</li></ul>"), false);
  });
});
