import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { extractApiErrorMessage } from "./extractApiErrorMessage";

const source = readFileSync(
  join(process.cwd(), "src/utils/showApiError.ts"),
  "utf8",
);

describe("showApiError", () => {
  it("skips RTK Query errors already shown by the global logger", () => {
    assert.match(source, /isRtkQueryError\(error\)/);
    assert.match(source, /extractApiErrorMessage\(error\)/);
    assert.match(source, /displayErrorMessage\(title\)/);
    assert.doesNotMatch(source, /displayErrorMessage\(title, description\)/);
  });

  it("reads the API message from a failed mutation shape", () => {
    const message = extractApiErrorMessage({
      data: { message: "Name is already taken" },
    });
    assert.equal(message.title, "Name is already taken");
    assert.equal(message.description, undefined);
  });
});
