import { companiesApi } from "..";
import { CreateDepartmentRequest } from "@/types/departments";

export const createDepartment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createDepartment: build.mutation<
      ServerResponse<any>,
      CreateDepartmentRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/departments`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const { useCreateDepartmentMutation } = createDepartment;
