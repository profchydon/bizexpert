import { cartApi } from ".";
import type { CartWriteItem } from "./cartLineTypes";

const addToCartApi = cartApi.injectEndpoints({
  endpoints: (query) => ({
    addToCart: query.mutation<
      ServerResponse<unknown>,
      {
        companyId: string;
        userId: string;
        items: CartWriteItem[];
      }
    >({
      query: ({ companyId, items, userId }) => ({
        url: `/${companyId}/carts/users/${userId}`,
        data: { items },
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useAddToCartMutation } = addToCartApi;
export { addToCartApi };
