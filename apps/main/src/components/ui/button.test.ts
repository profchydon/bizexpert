import assert from "node:assert/strict";
import { test } from "node:test";

import { buttonVariants } from "./button";

test("primary button focus ring avoids white offset double border", () => {
  const classes = buttonVariants({ variant: "primary", size: "md" });

  assert.match(classes, /focus-visible:ring-offset-0/);
  assert.match(classes, /focus-visible:ring-primary-600\/35/);
  assert.doesNotMatch(classes, /ring-offset-white/);
  assert.doesNotMatch(classes, /focus-visible:ring-slate-950\b/);
});
