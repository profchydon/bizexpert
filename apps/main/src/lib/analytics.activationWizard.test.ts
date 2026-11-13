import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("activation onboarding wizard wiring", () => {
  it("maps Onboarding to Signup Started and calls the wizard stages", () => {
    const activation = readFileSync(
      join(process.cwd(), "src/lib/activationAnalytics.ts"),
      "utf8",
    );
    const signup = readFileSync(
      join(process.cwd(), "src/container/NewOnboarding/Signup/SignupForm.tsx"),
      "utf8",
    );
    const setup = readFileSync(
      join(process.cwd(), "src/container/NewOnboarding/Setup/index.tsx"),
      "utf8",
    );
    const continueSetup = readFileSync(
      join(
        process.cwd(),
        "src/container/NewOnboarding/Setup/continueOnboardingSetup.ts",
      ),
      "utf8",
    );
    const complete = readFileSync(
      join(process.cwd(), "src/container/NewOnboarding/Complete/index.tsx"),
      "utf8",
    );
    const wrapper = readFileSync(
      join(process.cwd(), "src/components/HOC/AuthProtectWrapper.tsx"),
      "utf8",
    );

    assert.match(
      activation,
      /stage === "Verification" \|\| stage === "Onboarding"/,
    );
    assert.match(signup, /trackSignupStarted\(\)/);
    assert.match(setup, /trackActivationStage\("Onboarding"\)/);
    assert.match(
      continueSetup,
      /trackActivationStage\("Company Information"\)/,
    );
    assert.match(complete, /trackActivationStage\("Completed"\)/);
    assert.match(wrapper, /user.stage === "Onboarding"/);
  });
});
