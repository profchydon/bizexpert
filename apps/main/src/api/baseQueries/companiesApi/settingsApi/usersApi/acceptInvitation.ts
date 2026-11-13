import { IAcceptInvitationRequest } from "@/types/employees";
import { companiesApi } from "../..";

export const acceptUserInvitation = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    acceptUserInvitation: build.mutation<
      ServerResponse<any>,
      IAcceptInvitationRequest
    >({
      query: ({ code, payload }) => ({
        url: `/invitation/${code}`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const { useAcceptUserInvitationMutation } = acceptUserInvitation;
