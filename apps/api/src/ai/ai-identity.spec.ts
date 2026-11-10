import { dashboardChatIdentity, isDashboardChatPhone } from "./ai-identity";

const user = {
  id: "user-1",
  name: "Ada",
  email: "ada@example.com",
  phone: null,
  passwordHash: "x",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const business = {
  id: "biz-1",
  name: "Shop",
  slug: "shop",
  description: null,
  phone: null,
  email: null,
  address: null,
  logoUrl: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("dashboardChatIdentity", () => {
  it("scopes the synthetic phone to the signed-in user", () => {
    const identity = dashboardChatIdentity(user, business);
    expect(identity.whatsappPhone).toBe("dashboard:user-1");
    expect(identity.businessId).toBe("biz-1");
    expect(identity.isVerified).toBe(true);
    expect(isDashboardChatPhone(identity.whatsappPhone)).toBe(true);
    expect(isDashboardChatPhone("+2348011111111")).toBe(false);
  });
});
