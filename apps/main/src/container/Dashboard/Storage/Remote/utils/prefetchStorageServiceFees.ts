import { getServiceFees } from "@/api/baseQueries/feesApi/getServiceFees";
import { reduxStore } from "@/store";

export function prefetchStorageServiceFees() {
  return reduxStore.dispatch(
    getServiceFees.endpoints.getServiceFees.initiate(undefined, {
      forceRefetch: false,
    }),
  );
}
