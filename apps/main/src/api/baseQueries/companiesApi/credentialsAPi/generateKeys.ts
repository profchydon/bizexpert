import { ICredentials } from "@/types/credential";
import { companiesApi } from "..";

export const generateKeys = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    generateKeys: build.mutation<
      ServerResponse<ICredentials>,
      {
        companyId: string;
        environment: string;
        callback_url: string;
        webhook_url: string;
        expires_at: string;
      }
    >({
      query: ({ companyId, environment, ...rest }) => ({
        url: `/${companyId}/api-keys?environment=${environment}`,
        method: "POST",
        data: { ...rest },
      }),
      invalidatesTags: ["ApiKeys"],
    }),
  }),
});

export const { useGenerateKeysMutation } = generateKeys;
