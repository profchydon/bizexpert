import config from "@/config/config";
import { axiosBaseQuery } from "@/api/interceptor/axiosBaseQuery";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderTrackingApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `${config.API_URL!}/orders` }),
  endpoints: () => ({}),
  reducerPath: "ordersApi",
  keepUnusedDataFor: 30,
  tagTypes: ["Orders"],
});
