import { AlertTriangle } from "lucide-react";
import React from "react";
import {
  getMarketplaceLogisticsBannerTitle,
  MarketplaceLogistics,
  shouldShowMarketplaceLogisticsBanner,
} from "./types/marketplaceLogistics";

interface Props {
  logistics?: MarketplaceLogistics | null;
}

const HolidayBanner: React.FC<Props> = ({ logistics }) => {
  if (!shouldShowMarketplaceLogisticsBanner(logistics)) {
    return null;
  }

  const title = getMarketplaceLogisticsBannerTitle(logistics);

  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning-300 bg-warning-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-600" />
      <div className="flex flex-col gap-0.5">
        {title ? (
          <p className="text-sm font-semibold text-warning-700">{title}</p>
        ) : null}
        <p className="text-sm text-warning-600">{logistics.summary.trim()}</p>
      </div>
    </div>
  );
};

export default HolidayBanner;
