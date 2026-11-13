export const locationsQueryKeys = {
  list: (businessId: string) => ["locations", businessId] as const,
  staff: (businessId: string, locationId: string) =>
    ["location-staff", businessId, locationId] as const,
  members: (businessId: string) => ["members", businessId] as const,
};
