import { summaryTaxLabel, buildTaxSplitTooltip } from "@/lib/tax/display";
import {
  lineVatAmount,
  lineVatRate,
  resolveTaxLabels,
  vatColumnLabel,
} from "@/lib/tax/lineVat";
import { roundMoney } from "@/lib/tax/math";
import { ITransactionDetail } from "@/types/transactions";
import { countryForInvoiceLine } from "../transactionInvoiceCountry";

export interface TransactionInvoiceLine {
  id: string;
  name: string;
  type: string;
  country?: string;
  isServiceFee: boolean;
  quantity: number;
  unitPrice: number;
  netAmount: number;
  vatAmount: number;
  vatRate: number;
}

export interface TransactionInvoiceTotals {
  subtotal: number;
  vatLabel: string;
  vatTotal: number;
  vatTooltip: string;
  gatewayFee: number;
  total: number;
  deviceTax: number;
  serviceTax: number;
}

export interface TransactionInvoiceViewModel {
  lines: TransactionInvoiceLine[];
  itemCount: number;
  vatColumnLabel: string;
  currencySymbol: string;
  totals: TransactionInvoiceTotals;
}

const formatItemName = (value?: string) => {
  if (!value) {
    return "-";
  }

  const normalized = value.replaceAll("_", " ").replaceAll("-", " ").trim();
  if (!normalized) {
    return "-";
  }

  return normalized
    .split(/\s+/)
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
};

export const buildTransactionInvoiceViewModel = (
  transaction?: ITransactionDetail,
): TransactionInvoiceViewModel => {
  const items = transaction?.items_details ?? [];
  const metadata = transaction?.tax_breakdown?.tax_metadata;
  const deviceTax = roundMoney(
    Number(transaction?.tax_breakdown?.device_tax ?? 0),
  );
  const serviceTax = roundMoney(
    Number(transaction?.tax_breakdown?.service_tax ?? 0),
  );
  const { deviceLabel, serviceLabel } = resolveTaxLabels(metadata);
  const vatLabel = summaryTaxLabel({ deviceLabel, serviceLabel });
  const currencySymbol = transaction?.currency_symbol ?? "";
  const gatewayFee = roundMoney(Number(transaction?.gateway_fee ?? 0));

  const lines: TransactionInvoiceLine[] = items.map((row, index) => {
    const isServiceFee = row.type === "Service Fee";
    const netAmount = roundMoney(Number(row.amount ?? 0));

    return {
      id: `${row.name}-${index}`,
      name: formatItemName(row.name),
      type: row.type,
      country: countryForInvoiceLine({
        isServiceFee,
        orders: transaction?.multiple_order_details,
      }),
      isServiceFee,
      quantity: Number(row.quantity ?? 1),
      unitPrice: roundMoney(Number(row.unit_price ?? 0)),
      netAmount,
      vatAmount: lineVatAmount(netAmount, isServiceFee, metadata),
      vatRate: lineVatRate(isServiceFee, metadata),
    };
  });

  const deviceSubtotal = roundMoney(
    lines
      .filter((line) => !line.isServiceFee)
      .reduce((sum, line) => sum + line.netAmount, 0),
  );
  const serviceSubtotal = roundMoney(
    lines
      .filter((line) => line.isServiceFee)
      .reduce((sum, line) => sum + line.netAmount, 0),
  );
  const itemCount =
    transaction?.number_of_equipments ??
    lines
      .filter((line) => !line.isServiceFee)
      .reduce((sum, line) => sum + line.quantity, 0);

  return {
    lines,
    itemCount,
    vatColumnLabel: vatColumnLabel(metadata),
    currencySymbol,
    totals: {
      subtotal: roundMoney(deviceSubtotal + serviceSubtotal),
      vatLabel,
      vatTotal: roundMoney(deviceTax + serviceTax),
      vatTooltip: buildTaxSplitTooltip(currencySymbol, deviceTax, serviceTax),
      gatewayFee,
      total: roundMoney(Number(transaction?.amount ?? 0)),
      deviceTax,
      serviceTax,
    },
  };
};
