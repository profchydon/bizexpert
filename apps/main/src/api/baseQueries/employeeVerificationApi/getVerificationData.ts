import { employeeVerificationApi } from ".";
import { EmployeeVerificationResponse } from "@/types/employeeVerification";
import {
  verificationRequestAuth,
  verificationRequestParams,
} from "./verificationRequestAuth";

interface GetVerificationDataPayload {
  companyId: string;
  token: string;
}

export const getVerificationData = employeeVerificationApi.injectEndpoints({
  endpoints: (build) => ({
    getVerificationData: build.query<
      EmployeeVerificationResponse,
      GetVerificationDataPayload
    >({
      query: ({ companyId, token }) => ({
        url: `/${companyId}/employees/verification`,
        method: "GET",
        ...verificationRequestAuth,
        params: verificationRequestParams(token),
      }),
      providesTags: ["EmployeeVerification"],
    }),
  }),
});

export const { useGetVerificationDataQuery } = getVerificationData;
