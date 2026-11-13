type SearchParamsLike =
  | {
      get: (key: string) => string | null;
    }
  | null
  | undefined;

export type CartOverviewVariant = "marketplace" | "legacy";

export const resolveCartOverviewVariant = (
  searchParams: SearchParamsLike,
): CartOverviewVariant => {
  if (searchParams?.get("device-refresh") === "true") {
    return "legacy";
  }
  if (searchParams?.get("extra_items")) {
    return "legacy";
  }
  return "marketplace";
};
