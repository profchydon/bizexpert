import { IPlan } from "@/types/plans";
import { plansApi } from ".";

const plans = plansApi.injectEndpoints({
  endpoints: (query) => ({
    plans: query.query<ServerResponse<{ data: IPlan[] }>, void>({
      query: () => ({
        url: `/plans`,
      }),
    }),
  }),
});

export const { usePlansQuery } = plans;
