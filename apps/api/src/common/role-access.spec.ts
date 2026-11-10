import { BusinessRole } from "./enums";
import {
  canApproveStocktake,
  canBypassLocationPermissions,
  canManageMembers,
  canSell,
  isAssignableBusinessRole,
  isProtectedOwnerRole,
} from "./role-access";

describe("role-access", () => {
  it("protects owner and lets admin manage members", () => {
    expect(isProtectedOwnerRole(BusinessRole.OWNER)).toBe(true);
    expect(canManageMembers(BusinessRole.OWNER)).toBe(true);
    expect(canManageMembers(BusinessRole.ADMIN)).toBe(true);
    expect(canManageMembers(BusinessRole.BUSINESS_MANAGER)).toBe(false);
    expect(isAssignableBusinessRole(BusinessRole.OWNER)).toBe(false);
    expect(isAssignableBusinessRole(BusinessRole.CASHIER)).toBe(true);
  });

  it("maps Lumi ops and frontline roles onto existing API actions", () => {
    expect(canApproveStocktake(BusinessRole.STORE_MANAGER)).toBe(true);
    expect(canApproveStocktake(BusinessRole.CASHIER)).toBe(false);
    expect(canBypassLocationPermissions(BusinessRole.BUSINESS_MANAGER)).toBe(
      true,
    );
    expect(canBypassLocationPermissions(BusinessRole.STORE_KEEPER)).toBe(false);
    expect(canSell(BusinessRole.SALES_CASHIER)).toBe(true);
    expect(canSell(BusinessRole.ACCOUNTANT)).toBe(false);
    expect(canSell(BusinessRole.DEVELOPER)).toBe(false);
  });
});
