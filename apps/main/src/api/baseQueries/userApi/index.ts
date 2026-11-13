import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}` }),
  endpoints: () => ({}),
  reducerPath: "userApi",
  keepUnusedDataFor: 30,
  tagTypes: ["User"],
});
