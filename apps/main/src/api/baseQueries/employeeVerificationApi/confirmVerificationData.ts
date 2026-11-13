import { employeeVerificationApi } from ".";
import { ConfirmVerificationResponse } from "@/types/employeeVerification";
import {
  verificationRequestAuth,
  verificationRequestParams,
} from "./verificationRequestAuth";

interface ConfirmVerificationDataPayload {
  companyId: string;
  token: string;
  payload?: {
    delivery_note?: string;
  };
}

export const confirmVerificationData = employeeVerificationApi.injectEndpoints({
  endpoints: (build) => ({
    confirmVerificationData: build.mutation<
      ConfirmVerificationResponse,
      ConfirmVerificationDataPayload
    >({
      query: ({ companyId, token, payload }) => ({
        url: `/${companyId}/employees/verification/confirm`,
        method: "POST",
        ...verificationRequestAuth,
        data: payload,
        params: verificationRequestParams(token),
      }),
      invalidatesTags: ["EmployeeVerification"],
    }),
  }),
});

export const { useConfirmVerificationDataMutation } = confirmVerificationData;
