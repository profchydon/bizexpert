import { IEmployees } from "@/types/employees";
import { companiesApi } from "..";

const getEmployeeEquipment = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getEmployeeEquipment: query.query<
      ServerResponse<IEmployees>,
      { companyId: string; employeeId: string }
    >({
      query: ({ companyId, employeeId }) => ({
        url: `/${companyId}/employees/${employeeId}/dashboard`,
      }),
    }),
  }),
});

export const {
  useGetEmployeeEquipmentQuery,
  useLazyGetEmployeeEquipmentQuery,
} = getEmployeeEquipment;
