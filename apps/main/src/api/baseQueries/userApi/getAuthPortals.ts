import { userApi } from ".";

export interface AvailablePortals {
  vendor: boolean;
  msp: boolean;
  company: boolean;
  admin: boolean;
}

const getAuthPortals = userApi.injectEndpoints({
  endpoints: (query) => ({
    getAuthPortals: query.query<
      ServerResponse<{ available_portals: AvailablePortals }>,
      void
    >({
      query: () => ({
        url: `/auth/portals`,
      }),
    }),
  }),
});

export const { useGetAuthPortalsQuery } = getAuthPortals;
