import { cartApi } from ".";

const deleteCartItemApi = cartApi.injectEndpoints({
  endpoints: (query) => ({
    deleteCartItem: query.mutation<
      ServerResponse<unknown>,
      {
        companyId: string;
        userId: string;
        itemId: string;
      }
    >({
      query: ({ companyId, userId, itemId }) => ({
        url: `/${companyId}/carts/users/${userId}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useDeleteCartItemMutation } = deleteCartItemApi;
export { deleteCartItemApi };
