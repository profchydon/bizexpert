import { companiesApi } from "..";

export const editDepartment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    editDepartment: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        departmentId: string;
        headId?: string;
        members?: string[];
        name: string;
      }
    >({
      query: ({ companyId, departmentId, ...rest }) => ({
        url: `/${companyId}/departments/${departmentId}`,
        method: "PUT",
        data: { ...rest },
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const { useEditDepartmentMutation } = editDepartment;
