import { employeeVerificationApi } from ".";
import {
  UpdateVerificationResponse,
  EmployeeVerificationUpdatePayload,
} from "@/types/employeeVerification";
import {
  verificationRequestAuth,
  verificationRequestParams,
} from "./verificationRequestAuth";

interface UpdateVerificationDataPayload {
  companyId: string;
  token: string;
  payload: EmployeeVerificationUpdatePayload;
}

export const updateVerificationData = employeeVerificationApi.injectEndpoints({
  endpoints: (build) => ({
    updateVerificationData: build.mutation<
      UpdateVerificationResponse,
      UpdateVerificationDataPayload
    >({
      query: ({
        companyId,
        token,
        payload,
      }: UpdateVerificationDataPayload) => ({
        url: `/${companyId}/employees/verification`,
        method: "POST",
        ...verificationRequestAuth,
        data: payload,
        params: verificationRequestParams(token),
      }),
      invalidatesTags: ["EmployeeVerification"],
    }),
  }),
});

export const { useUpdateVerificationDataMutation } = updateVerificationData;
