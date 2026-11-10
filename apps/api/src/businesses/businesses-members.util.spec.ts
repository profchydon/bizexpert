import { BusinessRole } from "../common/enums";
import { requireAssignableRole } from "./businesses-members.util";

describe("businesses-members.util", () => {
  it("forbids assigning the owner role", () => {
    expect(() => requireAssignableRole(BusinessRole.OWNER)).toThrow(
      "Cannot assign the owner role",
    );
    expect(() => requireAssignableRole(BusinessRole.CASHIER)).not.toThrow();
    expect(() => requireAssignableRole(BusinessRole.ADMIN)).not.toThrow();
  });
});
