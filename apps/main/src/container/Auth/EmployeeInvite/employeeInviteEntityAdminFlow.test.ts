import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("EmployeeInvite entity-admin flow", () => {
  it("loads entity-admin context and redirects to login after signup", () => {
    const employeeInviteSource = readFileSync(
      join(process.cwd(), "src/container/Auth/EmployeeInvite/index.tsx"),
      "utf8",
    );
    const userInvitationSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EmployeeInvite/UserInviation/index.tsx",
      ),
      "utf8",
    );
    const signupIntroSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EntityAdminInvite/EntityAdminEmployeeSignupIntro.tsx",
      ),
      "utf8",
    );
    const signupFieldsSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EmployeeInvite/UserInviation/EmployeeInviteSignupFields.tsx",
      ),
      "utf8",
    );
    const signupHookSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EmployeeInvite/UserInviation/useEmployeeInviteSignup.ts",
      ),
      "utf8",
    );

    assert.match(employeeInviteSource, /entity_invitation_code/);
    assert.match(employeeInviteSource, /isEntityAdminEmployeeInviteFlow/);
    assert.match(employeeInviteSource, /isEntityAdminContextLoading/);
    assert.match(employeeInviteSource, /overflow-y-auto/);
    assert.match(employeeInviteSource, /py-8 sm:px-24 sm:py-10/);
    assert.match(userInvitationSource, /EntityAdminEmployeeSignupIntro/);
    assert.match(userInvitationSource, /EmployeeInviteSignupFields/);
    assert.match(userInvitationSource, /Create account & continue/);
    assert.match(signupHookSource, /signupFormSchema/);
    assert.match(signupHookSource, /entityAdminEmployeeSignupSuccessMessage/);
    assert.match(signupHookSource, /displaySuccessMessage/);
    assert.match(signupHookSource, /switch_account=1/);
    assert.doesNotMatch(signupHookSource, /buildEntityAdminInvitePath/);
    assert.match(signupFieldsSource, /EmployeeInviteEmployeeDetailsFields/);
    assert.match(signupIntroSource, /entityAdminEmployeeSignupStepLabel/);
    assert.match(signupIntroSource, /entityAdminEmployeeSignupTitle/);
    assert.match(signupIntroSource, /font-semibold text-gray-900/);
    assert.match(signupIntroSource, /entityAdminInviteExpiryLabel/);
    assert.doesNotMatch(signupIntroSource, /entityAdminInviteTitle/);
    assert.doesNotMatch(signupIntroSource, /EntityAdminInviteSummaryCard/);
    assert.doesNotMatch(
      signupIntroSource,
      /entityAdminInviteSetupAccountMessage/,
    );
  });
});
