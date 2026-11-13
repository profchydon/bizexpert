import type { EntityAdminRow } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityPersonLabel";
import type { EntityAdminInvitation } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitation";

export interface ManagedEntityAdmin extends EntityAdminRow {
  pending: boolean;
  invitationId?: string;
}

const cancellable = new Set(["pending", "expired"]);

export function managedEntityAdmins(
  admins: EntityAdminRow[],
  invitations: EntityAdminInvitation[],
): ManagedEntityAdmin[] {
  const accepted = admins.map((admin) => ({ ...admin, pending: false }));
  const acceptedIds = new Set(admins.map((admin) => admin.id));
  const acceptedEmails = new Set(
    admins.map((admin) => admin.email.trim().toLowerCase()).filter(Boolean),
  );

  const pending = invitations
    .filter((invitation) => cancellable.has(invitation.status))
    .filter((invitation) => {
      if (invitation.user_id && acceptedIds.has(invitation.user_id)) {
        return false;
      }
      const email = invitation.email?.trim().toLowerCase();
      return !email || !acceptedEmails.has(email);
    })
    .map((invitation) => ({
      id: invitation.user_id || invitation.id,
      name: invitation.email,
      email: invitation.email,
      pending: true,
      invitationId: invitation.id,
    }));

  return [...accepted, ...pending];
}

export function acceptedAdminCount(rows: ManagedEntityAdmin[]) {
  return rows.filter((row) => !row.pending).length;
}
