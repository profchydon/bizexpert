import { ICompany, IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import { userApi } from ".";

const getUserProfile = userApi.injectEndpoints({
  endpoints: (query) => ({
    getUserProfile: query.query<
      ServerResponse<{
        user: IUser;
        company: ICompany;
        entities?: EntityMembership[];
      }>,
      void
    >({
      query: () => ({
        url: `/me`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery } =
  getUserProfile;
