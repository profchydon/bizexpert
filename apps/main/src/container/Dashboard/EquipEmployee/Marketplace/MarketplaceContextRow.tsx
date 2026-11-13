"use client";

import LocalTimeBanner from "./LocalTimeBanner";
import OrderingForBanner from "./OrderingForBanner";
import { useOrderingFor } from "./useOrderingFor";

interface Props {
  countryCode?: string;
  countryLabel?: string;
}

const MarketplaceContextRow = ({ countryCode, countryLabel }: Props) => {
  const { visible } = useOrderingFor();

  if (!visible) {
    return (
      <LocalTimeBanner countryCode={countryCode} countryLabel={countryLabel} />
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <OrderingForBanner className="sm:flex-1" />
      <LocalTimeBanner
        countryCode={countryCode}
        countryLabel={countryLabel}
        className="sm:shrink-0"
      />
    </div>
  );
};

export default MarketplaceContextRow;
