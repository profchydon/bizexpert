import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}` }),
  endpoints: () => ({}),
  reducerPath: "authApi",
  keepUnusedDataFor: 30,
  tagTypes: ["AuthApi"],
});
