import assert from "node:assert/strict";
import test from "node:test";
import {
  supportsTicketIngestSync,
  syncFrequencyOptionFor,
  toSyncFrequencyOption,
} from "./integrationSyncFrequency";

test("supportsTicketIngestSync includes zoho desk and zendesk", () => {
  assert.equal(supportsTicketIngestSync("zoho-desk"), true);
  assert.equal(supportsTicketIngestSync("zendesk"), true);
  assert.equal(supportsTicketIngestSync("linear"), false);
});

test("syncFrequencyOptionFor defaults to weekly", () => {
  assert.equal(syncFrequencyOptionFor(undefined)?.value, "Weekly");
  assert.equal(syncFrequencyOptionFor("Daily")?.value, "Daily");
});

test("syncFrequencyOptionFor returns a mutable autocomplete option", () => {
  const option = syncFrequencyOptionFor("Monthly");
  assert.deepEqual(option, {
    value: "Monthly",
    label: "Monthly (Every 30days)",
  });
  assert.equal(Object.isFrozen(option), false);
});

test("toSyncFrequencyOption accepts a single Autocomplete value", () => {
  assert.deepEqual(
    toSyncFrequencyOption({ value: "Daily", label: "Daily (Every 24hrs)" }),
    {
      value: "Daily",
      label: "Daily (Every 24hrs)",
    },
  );
  assert.equal(
    toSyncFrequencyOption([{ value: "Daily", label: "Daily" }]),
    null,
  );
  assert.equal(toSyncFrequencyOption(null), null);
});
