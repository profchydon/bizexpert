export const DEFAULT_DELIVERY_ESTIMATE = "2 - 3 Days";

export const formatDeliveryEstimate = (eta?: string | null) => {
  const normalizedEta = eta?.trim();

  if (!normalizedEta) {
    return DEFAULT_DELIVERY_ESTIMATE;
  }

  if (/day/i.test(normalizedEta)) {
    return normalizedEta;
  }

  return `${normalizedEta} Days`;
};
