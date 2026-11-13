import { companiesApi } from "../..";

const getNotificationGroup = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getNotificationGroup: query.query<
      ServerResponse<any>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/settings/notifications`,
      }),
    }),
  }),
});

export const { useGetNotificationGroupQuery } = getNotificationGroup;
