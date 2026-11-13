import { companiesApi } from "..";

export const deleteDepartment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteDepartment: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        departmentId: string;
      }
    >({
      query: ({ companyId, departmentId }) => ({
        url: `/${companyId}/departments/${departmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const { useDeleteDepartmentMutation } = deleteDepartment;
