const getCurrencySymbolFromCode = (currencyCode?: string) => {
  if (!currencyCode) {
    return "$";
  }

  try {
    const formattedParts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);

    return (
      formattedParts.find((part) => part.type === "currency")?.value ||
      currencyCode
    );
  } catch {
    return "$";
  }
};

export default getCurrencySymbolFromCode;
