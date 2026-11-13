import { summaryTaxLabel } from "./display";
import { roundMoney } from "./math";

export type TaxMetadataLike =
  | {
      device_tax_rate?: number | null;
      service_tax_rate?: number | null;
      device_tax_amount?: number | null;
      service_tax_amount?: number | null;
      tax_label_device?: string | null;
      tax_label_service?: string | null;
    }
  | null
  | undefined;

export const resolveTaxRates = (metadata?: TaxMetadataLike) => ({
  deviceRate: Number(metadata?.device_tax_rate ?? 0),
  serviceRate: Number(metadata?.service_tax_rate ?? 0),
});

export const resolveTaxLabels = (metadata?: TaxMetadataLike) => ({
  deviceLabel: metadata?.tax_label_device || "Tax",
  serviceLabel: metadata?.tax_label_service || "Tax",
});

export const vatColumnLabel = (metadata?: TaxMetadataLike): string =>
  summaryTaxLabel(resolveTaxLabels(metadata));

export const lineVatRate = (
  isServiceFee: boolean,
  metadata?: TaxMetadataLike,
): number => {
  const { deviceRate, serviceRate } = resolveTaxRates(metadata);
  return isServiceFee ? serviceRate : deviceRate;
};

export const lineVatAmount = (
  netAmount: number,
  isServiceFee: boolean,
  metadata?: TaxMetadataLike,
): number => roundMoney(netAmount * lineVatRate(isServiceFee, metadata));

export const formatTaxRatePercent = (rate: number): string =>
  `${Math.round(rate * 1000) / 10}%`;
