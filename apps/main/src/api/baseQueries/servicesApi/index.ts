import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}` }),
  endpoints: () => ({}),
  reducerPath: "servicesApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Services"],
});
