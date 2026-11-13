import { track } from "@/lib/analytics";

export type EntityAdminInviteAction = "viewed" | "completed";

export function trackEntityAdminInvite(properties: {
  action: EntityAdminInviteAction;
  invitation_id?: string;
  entity_id?: string;
}): void {
  track("Entity Admin Invite", {
    action: properties.action,
    ...(properties.invitation_id
      ? { invitation_id: properties.invitation_id }
      : {}),
    ...(properties.entity_id ? { entity_id: properties.entity_id } : {}),
  });
}
