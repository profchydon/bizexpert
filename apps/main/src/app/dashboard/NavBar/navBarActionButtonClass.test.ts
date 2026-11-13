import assert from "node:assert/strict";
import { test } from "node:test";
import { navBarActionButtonClass } from "./navBarActionButtonClass";

test("nav bar action buttons use compact mobile sizing", () => {
  assert.match(navBarActionButtonClass, /h-9 w-9/);
  assert.match(navBarActionButtonClass, /sm:h-10 sm:w-10/);
  assert.match(navBarActionButtonClass, /shrink-0/);
});
