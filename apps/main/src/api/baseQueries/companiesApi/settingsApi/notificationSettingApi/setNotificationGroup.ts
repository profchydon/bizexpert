import { companiesApi } from "../..";
import { ISetNotifications } from "@/types/notificationSetting";

export const setNotificationGroup = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    setNotificationGroup: build.mutation<
      ServerResponse<any>,
      ISetNotifications
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/settings/notifications`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const { useSetNotificationGroupMutation } = setNotificationGroup;
