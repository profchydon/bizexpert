import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const feesApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}/companies` }),
  endpoints: () => ({}),
  reducerPath: "feesApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Fees"],
});
