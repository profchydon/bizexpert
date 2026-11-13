import { IEmployeeOrderDetail } from "@/types/employees";
import { companiesApi } from "..";

const getEmployeeOrderDetail = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getEmployeeOrderDetail: query.query<
      ServerResponse<IEmployeeOrderDetail>,
      { companyId: string; employeeId: string; orderId: string }
    >({
      query: ({ companyId, employeeId, orderId }) => ({
        url: `/${companyId}/employees/${employeeId}/orders/${orderId}`,
      }),
      providesTags: ["SingleEmployees"],
    }),
  }),
});

export const { useGetEmployeeOrderDetailQuery } = getEmployeeOrderDetail;
