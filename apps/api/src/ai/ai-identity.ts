import { Business, User, WhatsappIdentity } from "@prisma/client";

export function dashboardChatIdentity(
  user: User,
  business: Business,
): WhatsappIdentity {
  const now = new Date();
  return {
    id: `dashboard:${user.id}`,
    userId: user.id,
    businessId: business.id,
    whatsappPhone: `dashboard:${user.id}`,
    isVerified: true,
    defaultLocationId: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function isDashboardChatPhone(phone: string): boolean {
  return phone.startsWith("dashboard:");
}
