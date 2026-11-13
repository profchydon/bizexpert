import type { AvailablePortals } from "@/api/baseQueries/userApi/getAuthPortals";
import { authApi } from ".";

export type PortalKey = keyof AvailablePortals;

export const portalAuthorizationPaths: Record<PortalKey, string> = {
  company: "/sessions/authorization",
  vendor: "/vendors/sessions/authorization",
  msp: "/msps/sessions/authorization",
  admin: "/admin/auth/authorization",
};

export const portalAuthorization = authApi.injectEndpoints({
  endpoints: (build) => ({
    getPortalAuthorizationUrl: build.mutation<
      ServerResponse<{ redirect_url: string; state?: string }>,
      string
    >({
      query: (url) => ({
        url,
        method: "GET",
        skipAuth: true,
      }),
    }),
  }),
});

export const { useGetPortalAuthorizationUrlMutation } = portalAuthorization;
