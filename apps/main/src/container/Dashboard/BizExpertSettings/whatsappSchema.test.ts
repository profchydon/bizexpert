import assert from "node:assert/strict";
import { test } from "node:test";
import { toWhatsappLinkPayload, whatsappLinkSchema } from "./whatsappSchema";
import { unlinkWhatsappDescription } from "./unlinkWhatsappCopy";

test("toWhatsappLinkPayload omits a blank location", () => {
  const payload = toWhatsappLinkPayload({
    whatsappPhone: " +2348012345678 ",
    defaultLocationId: "  ",
  });
  assert.deepEqual(payload, { whatsappPhone: "+2348012345678" });
});

test("toWhatsappLinkPayload includes a location id", () => {
  const payload = toWhatsappLinkPayload({
    whatsappPhone: "+2348012345678",
    defaultLocationId: "loc-1",
  });
  assert.equal(payload.defaultLocationId, "loc-1");
});

test("whatsappLinkSchema rejects a non-E.164 phone", () => {
  const parsed = whatsappLinkSchema.safeParse({
    whatsappPhone: "08012345678",
  });
  assert.equal(parsed.success, false);
});

test("whatsappLinkSchema accepts E.164", () => {
  const parsed = whatsappLinkSchema.safeParse({
    whatsappPhone: "+2348012345678",
  });
  assert.equal(parsed.success, true);
});

test("unlink copy includes the phone number", () => {
  assert.match(unlinkWhatsappDescription("+2348012345678"), /\+2348012345678/);
});
