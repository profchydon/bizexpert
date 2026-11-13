export type DirectoryAdminState = "pending" | "accepted";

export interface DirectoryAdminMatch {
  id: string;
  email?: string;
  pending: boolean;
}

export function withDirectoryAdminState<
  T extends { value: string; email?: string },
>(options: T[], admins: DirectoryAdminMatch[]) {
  const byId = new Map(admins.map((admin) => [admin.id, admin]));
  const byEmail = new Map(
    admins.flatMap((admin) => {
      const email = admin.email?.trim().toLowerCase();
      return email ? [[email, admin] as const] : [];
    }),
  );

  return options.map((option) => {
    const match =
      byId.get(option.value) ??
      (option.email
        ? byEmail.get(option.email.trim().toLowerCase())
        : undefined);
    const inviteState: DirectoryAdminState | undefined = match
      ? match.pending
        ? "pending"
        : "accepted"
      : undefined;

    return { ...option, inviteState };
  });
}
