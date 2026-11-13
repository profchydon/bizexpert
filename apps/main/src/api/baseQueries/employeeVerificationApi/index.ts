import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const employeeVerificationApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}/companies` }),
  reducerPath: "employeeVerificationApi",
  tagTypes: ["EmployeeVerification"],
  endpoints: () => ({}),
});
