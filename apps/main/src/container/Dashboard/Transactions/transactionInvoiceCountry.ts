import type { ITransactionOrderDetail } from "@/types/transactions";

export const countryForInvoiceLine = ({
  isServiceFee,
  orders,
}: {
  isServiceFee: boolean;
  orders?: ITransactionOrderDetail[];
}) => {
  if (isServiceFee) {
    return undefined;
  }

  const countries = [
    ...new Set(
      (orders ?? [])
        .map((order) => order.country_name?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  ];

  if (countries.length === 1) {
    return countries[0];
  }

  return undefined;
};
