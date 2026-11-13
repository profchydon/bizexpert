import type { CartDomain } from "./cartDomain";

export function isolateCartItems<P, A>(
  domain: CartDomain,
  products: P[],
  actions: A[],
): { products: P[]; actions: A[] } {
  if (domain === "storage") return { products: [], actions };
  if (domain === "marketplace") return { products, actions: [] };
  if (products.length > 0) return { products, actions: [] };
  return { products, actions };
}
