import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const plansApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}` }),
  endpoints: () => ({}),
  reducerPath: "plansApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Plans"],
});
