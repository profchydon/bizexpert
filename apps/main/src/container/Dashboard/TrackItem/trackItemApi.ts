import { bizexpertApi } from "@/lib/bizexpert/api";
import type { Product } from "@/types/bizexpert";
import {
  isMissingBarcodeLookup,
  lookupErrorStatus,
  mergeTrackItemMatches,
} from "./trackItemLookup";

export async function fetchTrackItemMatches(
  businessId: string,
  query: string,
): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  const [barcodeHit, searchHits] = await Promise.all([
    bizexpertApi
      .get(
        `/businesses/${businessId}/products/by-barcode/${encodeURIComponent(q)}`,
      )
      .then((res) => res.data as Product)
      .catch((error: unknown) => {
        if (isMissingBarcodeLookup(lookupErrorStatus(error))) return null;
        throw error;
      }),
    bizexpertApi
      .get(`/businesses/${businessId}/products/search`, { params: { q } })
      .then((res) => (Array.isArray(res.data) ? (res.data as Product[]) : [])),
  ]);

  return mergeTrackItemMatches(barcodeHit, searchHits);
}
