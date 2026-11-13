import { ICredentials } from "@/types/credential";
import { companiesApi } from "..";

export const updateCredentialURL = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateCredentialURL: build.mutation<
      ServerResponse<ICredentials>,
      {
        companyId: string;
        environment: string;
        callback_url: string;
        webhook_url: string;
      }
    >({
      query: ({ companyId, environment, ...rest }) => ({
        url: `/${companyId}/api-keys?environment=${environment}`,
        method: "PUT",
        data: { ...rest },
      }),
      invalidatesTags: ["ApiKeys"],
    }),
  }),
});

export const { useUpdateCredentialURLMutation } = updateCredentialURL;
