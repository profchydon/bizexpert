import { companiesApi } from "..";

export const moveMembers = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    moveMembers: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        departmentId: string;
        destination_dept_id: string;
        members?: string[];
      }
    >({
      query: ({ companyId, departmentId, ...rest }) => ({
        url: `/${companyId}/departments/${departmentId}/users/move`,
        method: "PUT",
        data: { ...rest },
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const { useMoveMembersMutation } = moveMembers;
