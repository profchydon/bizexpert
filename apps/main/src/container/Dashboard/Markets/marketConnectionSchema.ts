import { z } from "zod";

export const marketConnectionSchema = z.object({
  apiKey: z.string().trim().min(8, "API key must be at least 8 characters"),
  remoteStoreId: z.string().trim().min(1, "Select a market store"),
  locationId: z.string().uuid("Select a BizExpert store"),
});

export type MarketConnectionValues = z.infer<typeof marketConnectionSchema>;

export const marketConnectionDefaults: MarketConnectionValues = {
  apiKey: "",
  remoteStoreId: "",
  locationId: "",
};

export function toMarketConnection(args: {
  values: MarketConnectionValues;
  remoteStoreName: string;
  locationName: string;
  mappedRemoteProductIds?: string[];
}): {
  apiKey: string;
  remoteStoreId: string;
  remoteStoreName: string;
  locationId: string;
  locationName: string;
  mappedRemoteProductIds: string[];
  connectedAt: string;
} {
  return {
    apiKey: args.values.apiKey.trim(),
    remoteStoreId: args.values.remoteStoreId,
    remoteStoreName: args.remoteStoreName,
    locationId: args.values.locationId,
    locationName: args.locationName,
    mappedRemoteProductIds: args.mappedRemoteProductIds ?? [],
    connectedAt: new Date().toISOString(),
  };
}
