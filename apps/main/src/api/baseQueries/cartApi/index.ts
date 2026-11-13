import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}/companies` }),
  endpoints: () => ({}),
  reducerPath: "cartApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Cart"],
});
