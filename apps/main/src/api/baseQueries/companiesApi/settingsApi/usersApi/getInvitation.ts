import { IUserInvitation } from "@/types/employees";
import { companiesApi } from "../..";

export const getInvitation = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getInvitation: build.query<
      ServerResponse<IUserInvitation>,
      { code: string }
    >({
      query: ({ code }) => ({
        url: `/invitation/${code}`,
      }),
    }),
  }),
});

export const { useGetInvitationQuery, useLazyGetInvitationQuery } =
  getInvitation;
