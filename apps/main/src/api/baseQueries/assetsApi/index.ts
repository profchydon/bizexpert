import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const assetsApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}` }),
  endpoints: () => ({}),
  reducerPath: "assetsApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Assets"],
});
