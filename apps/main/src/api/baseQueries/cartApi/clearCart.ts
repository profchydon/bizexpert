import { cartApi } from ".";

const clearCartApi = cartApi.injectEndpoints({
  endpoints: (query) => ({
    clearCart: query.mutation<
      ServerResponse<unknown>,
      {
        companyId: string;
        userId: string;
      }
    >({
      query: ({ companyId, userId }) => ({
        url: `/${companyId}/carts/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useClearCartMutation } = clearCartApi;
export { clearCartApi };
