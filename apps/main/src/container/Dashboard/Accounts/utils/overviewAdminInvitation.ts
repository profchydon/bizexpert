const openInviteStatuses = new Set(["pending", "expired", "accepted"]);

export function overviewShowsPendingAdminInvitation(
  adminCount: number,
  invitations: { status: string }[],
): boolean {
  if (adminCount > 0) return false;
  return invitations.some((invitation) =>
    openInviteStatuses.has(invitation.status),
  );
}
