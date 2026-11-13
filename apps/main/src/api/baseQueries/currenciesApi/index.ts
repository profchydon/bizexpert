import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const currenciesApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}/currencies` }),
  endpoints: () => ({}),
  reducerPath: "currenciesApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Currencies"],
});
