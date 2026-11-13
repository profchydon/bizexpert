import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  entityAdminInviteAlternateLoginLabel,
  entityAdminInviteErrorMessage,
  entityAdminInviteExistingAccountMessage,
  entityAdminInviteExpiryChipLabel,
  entityAdminInviteExpiryLabel,
  entityAdminInviteEyebrow,
  entityAdminEmployeeSignupStepLabel,
  entityAdminEmployeeSignupSuccessMessage,
  entityAdminEmployeeSignupTitle,
  entityAdminInviteIntro,
  entityAdminInviteIntroFromInviter,
  entityAdminInviteIntroLine,
  entityAdminInviteIsExpired,
  entityAdminInviteRoleLabel,
  entityAdminInviteSetupAccountMessage,
  entityAdminInviteStatusMessage,
  entityAdminInviteTitle,
} from "./entityAdminInviteCopy";

describe("entityAdminInviteCopy", () => {
  it("builds invite title and intro copy", () => {
    assert.equal(entityAdminInviteEyebrow(), "Admin invite");
    assert.equal(entityAdminInviteTitle(), "Accept your invite");
    assert.equal(
      entityAdminInviteIntro("Intensa", "Intensa Nigeria 2"),
      "Intensa has invited you to administer Intensa Nigeria 2 on Rayda Remote.",
    );
    assert.equal(
      entityAdminInviteIntroFromInviter("Joe", "Intensa Nigeria 2"),
      "Joe has invited you to administer Intensa Nigeria 2 on Rayda Remote.",
    );
    assert.equal(
      entityAdminInviteIntroLine("Joe", "Intensa", "Intensa Nigeria 2"),
      "Joe has invited you to administer Intensa Nigeria 2 on Rayda Remote.",
    );
    assert.equal(
      entityAdminInviteIntroLine(undefined, "Intensa", "Intensa Nigeria 2"),
      "Intensa has invited you to administer Intensa Nigeria 2 on Rayda Remote.",
    );
  });

  it("builds existing-account and setup-account helper copy", () => {
    assert.equal(entityAdminInviteRoleLabel(), "Entity administrator");
    assert.equal(
      entityAdminInviteAlternateLoginLabel(),
      "Use a different account",
    );
    assert.equal(entityAdminEmployeeSignupStepLabel(), "Step 1 of 2");
    assert.equal(entityAdminEmployeeSignupTitle(), "Create your account");
    assert.match(
      entityAdminEmployeeSignupSuccessMessage(),
      /Account created successfully/i,
    );
    assert.match(
      entityAdminInviteExistingAccountMessage(),
      /Accept below to get access/i,
    );
    assert.match(
      entityAdminInviteSetupAccountMessage(),
      /Create your account below/i,
    );
  });

  it("formats expiry labels from the invitation timestamp", () => {
    const label = entityAdminInviteExpiryLabel("2030-08-18T15:29:45.000000Z");
    assert.match(label ?? "", /expires in \d+ day/);
    const chip = entityAdminInviteExpiryChipLabel(
      "2030-08-18T15:29:45.000000Z",
    );
    assert.match(chip ?? "", /Expires in \d+ days/);
    assert.equal(
      entityAdminInviteIsExpired("2020-01-01T00:00:00.000000Z"),
      true,
    );
  });

  it("maps invitation status to user-facing messages", () => {
    assert.equal(entityAdminInviteStatusMessage("pending"), null);
    assert.match(
      entityAdminInviteStatusMessage("accepted") ?? "",
      /already been accepted/,
    );
    assert.equal(entityAdminInviteErrorMessage(404), "Invitation not found.");
    assert.equal(
      entityAdminInviteErrorMessage(410),
      "This invitation has expired.",
    );
  });
});
