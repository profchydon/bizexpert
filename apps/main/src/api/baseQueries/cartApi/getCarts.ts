import { ICart } from "@/types/cart";
import type { SubscriberSaving } from "@/lib/pricing/subscriberSaving";
import { cartApi } from ".";
import type { UnknownCartLine } from "./cartLineTypes";
import { splitCartLines } from "./splitCartLines";

export type CartServerResponse = ServerResponse<UnknownCartLine[]> & {
  savings?: SubscriberSaving;
};

const getCartsApi = cartApi.injectEndpoints({
  endpoints: (query) => ({
    getCarts: query.query<
      CartServerResponse,
      {
        companyId: string;
        userId: string;
      }
    >({
      query: ({ companyId, userId }) => ({
        url: `/${companyId}/carts/users/${userId}`,
      }),
      providesTags: ["Cart"],
      transformResponse(baseQueryReturnValue: CartServerResponse) {
        const lines = Array.isArray(baseQueryReturnValue.data)
          ? baseQueryReturnValue.data
          : [];
        return {
          ...baseQueryReturnValue,
          data: lines,
        };
      },
    }),
  }),
});

export const { useGetCartsQuery, useLazyGetCartsQuery } = getCartsApi;
export { getCartsApi };

export function marketplaceItemsFromCartResponse(
  data: UnknownCartLine[] | undefined,
): ICart[] {
  return splitCartLines(data).marketplace;
}
