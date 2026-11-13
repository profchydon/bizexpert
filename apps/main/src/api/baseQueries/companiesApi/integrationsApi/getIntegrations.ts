import { companiesApi } from "..";

// export const getIntegrations = companiesApi.injectEndpoints({
//   endpoints: (build) => ({
//     getIntegrations: build.query<ServerResponse<any>, { companyId: string }>({
//       query: ({ companyId }) => ({
//         url: `/${companyId}/integrations/all`,
//       }),
//       providesTags: ["Integrations"],
//     }),
//   }),
// });

// export const { useGetIntegrationsQuery } = getIntegrations;

export const getIntegrations = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getIntegrations: build.query<
      ServerResponse<any>,
      { companyId: string; params?: { page?: number; category?: string } }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/integrations/all`,
        params,
      }),
      providesTags: ["Integrations"],
    }),
  }),
});

export const { useGetIntegrationsQuery } = getIntegrations;
