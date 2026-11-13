export const settingsQueryKeys = {
  profile: ["auth-profile"] as const,
  identities: (businessId: string) =>
    ["whatsapp-identities", businessId] as const,
};
