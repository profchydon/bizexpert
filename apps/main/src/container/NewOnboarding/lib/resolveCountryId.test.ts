import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolveCountryId } from "./resolveCountryId";

const countries = [
  { id: "ng-id", name: "Nigeria" },
  { id: "gb-id", name: "United Kingdom" },
];

const wizard = readFileSync(
  "src/container/NewOnboarding/lib/useOnboardingWizard.ts",
  "utf8",
);

test("a stale session with no country still resolves from the step 4 choice", () => {
  assert.equal(resolveCountryId(undefined, countries, "Nigeria"), "ng-id");
});

test("this is the bug: a fresh signup session carries no country at all", () => {
  assert.equal(resolveCountryId(undefined, [], "Nigeria"), "");
  assert.equal(resolveCountryId(undefined, countries, "Nigeria"), "ng-id");
});

test("the step 4 choice wins over a stale session country", () => {
  assert.equal(
    resolveCountryId("old-id", countries, "United Kingdom"),
    "gb-id",
  );
});

test("the session country is used when no country was chosen", () => {
  assert.equal(
    resolveCountryId("session-id", countries, undefined),
    "session-id",
  );
  assert.equal(resolveCountryId("session-id", countries, ""), "session-id");
});

test("matching ignores case and surrounding whitespace", () => {
  assert.equal(resolveCountryId(undefined, countries, " nigeria "), "ng-id");
});

test("an unknown country name falls back instead of inventing an id", () => {
  assert.equal(
    resolveCountryId("session-id", countries, "Atlantis"),
    "session-id",
  );
  assert.equal(resolveCountryId(undefined, countries, "Atlantis"), "");
});

test("a non string answer cannot crash the lookup", () => {
  assert.equal(
    resolveCountryId("session-id", countries, ["Nigeria"]),
    "session-id",
  );
});

test("checkout no longer depends on matching the country name", () => {
  assert.equal(wizard.includes("resolveCountryId"), false);
  assert.equal(wizard.includes("useGetCountriesQuery"), false);
});
