import routes from "@/routes";

export const storageAppRoutes = {
  dashboard: routes.OVERVIEW,
  storage: routes.STORAGE,
  storageImport: routes.STORAGE_IMPORT,
  storageCheckout: `${routes.STORAGE}/checkout`,
  storageUnifiedCheckout: `${routes.STORAGE}/unified-checkout`,
  storageOrderSummary: routes.STORAGE_ORDER_SUMMARY,
  orderDetails: (id: string) => `${routes.ORDERS}/${id}`,
};
