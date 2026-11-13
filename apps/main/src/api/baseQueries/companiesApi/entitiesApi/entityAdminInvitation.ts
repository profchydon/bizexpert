export type EntityAdminInvitationStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "cancelled"
  | "access_revoked"
  | "rejected";

export interface EntityAdminInvitation {
  id: string;
  email: string;
  user_id?: string | null;
  status: EntityAdminInvitationStatus;
}

export interface EntityAdminInviteRequest {
  admin_user_ids?: string[];
  admin_emails?: string[];
}

export interface RevokeEntityAdminRequest {
  user_id?: string;
  email?: string;
}

export function entityAdminInvitationsFromResponse(
  body: unknown,
): EntityAdminInvitation[] {
  if (Array.isArray(body)) return body as EntityAdminInvitation[];
  if (!body || typeof body !== "object") return [];
  const data = (body as { data?: unknown }).data;
  if (Array.isArray(data)) return data as EntityAdminInvitation[];
  if (data && typeof data === "object") {
    const nested = (data as { data?: unknown }).data;
    if (Array.isArray(nested)) return nested as EntityAdminInvitation[];
  }
  return [];
}
