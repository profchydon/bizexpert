import { AddEmployeeRequest } from "@/types/employees";
import { companiesApi } from "..";

export const makeARequest = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    makeARequest: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        employeeId: string;
        department_id: string;
        currency_id: string;
        catalog_id: string;
        items: {
          asset_pricing_id: string;
          quantity: number;
          amount: number;
        }[];
      }
    >({
      query: ({ companyId, employeeId, ...rest }) => ({
        url: `/${companyId}/employees/${employeeId}/request`,
        method: "POST",
        data: rest,
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const { useMakeARequestMutation } = makeARequest;
