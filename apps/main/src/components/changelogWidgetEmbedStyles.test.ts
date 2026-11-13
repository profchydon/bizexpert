import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHANGELOG_IFRAME_SRC,
  changelogIframeClassName,
} from "./changelogWidgetEmbedStyles";

test("changelog iframe uses responsive sizing classes", () => {
  const className = changelogIframeClassName();

  assert.match(className, /w-full/);
  assert.match(className, /max-w-\[400px\]/);
  assert.match(className, /calc\(100dvh-8rem\)/);
});

test("changelog iframe source includes widget limit", () => {
  assert.match(CHANGELOG_IFRAME_SRC, /widget\?limit=10/);
});
