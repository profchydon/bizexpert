export function subscriptionPaymentLabel(company: {
  card_brand?: string | null;
  card_last_four?: string | null;
}): string {
  if (!company.card_last_four) {
    return "This is the method used in making payment";
  }

  const brand = company.card_brand
    ? `${company.card_brand.charAt(0).toUpperCase()}${company.card_brand.slice(1)}`
    : "Card";

  return `${brand} •••• ${company.card_last_four}`;
}
