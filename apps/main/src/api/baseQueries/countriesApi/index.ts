import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const countriesApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}/countries` }),
  endpoints: () => ({}),
  reducerPath: "countriesApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Countries", "BankDetails"],
});
