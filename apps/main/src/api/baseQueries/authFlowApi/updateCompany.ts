import { ICompany, IUser } from "@/types/auth";
import { authApi } from ".";

export const updateCompany = authApi.injectEndpoints({
  endpoints: (build) => ({
    updateCompany: build.mutation<
      ServerResponse<{ company?: ICompany }>,
      { companyId: string; company: Partial<ICompany> }
    >({
      query: ({ company, companyId }) => ({
        url: `/companies/${companyId}`,
        method: "PUT",
        data: { ...company },
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useUpdateCompanyMutation } = updateCompany;
