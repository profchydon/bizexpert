import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { roundedImage_placeholder } from "@/assets/images";
import { Button } from "@/components/ui/button";
import formatAmount from "@/utils/formatAmount";
import type { IAsset } from "@/types/assets";

interface Props {
  asset: IAsset;
  added: boolean;
  onAdd: (asset: IAsset) => void;
}

const buildSubtitle = (asset: IAsset): string => {
  const specs = (asset.spec ?? [])
    .map((entry) => entry?.value)
    .filter((value): value is string => Boolean(value && value.trim()))
    .slice(0, 2);
  return [asset.category, ...specs].filter(Boolean).join(" · ");
};

const MarketplaceDeviceRow: React.FC<Props> = ({ asset, added, onAdd }) => {
  const subtitle = buildSubtitle(asset);

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-4 last:border-0">
      <Image
        src={asset.images?.[0] || roundedImage_placeholder}
        alt={asset.name}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-lg object-contain"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-gray-900">
          {asset.name}
        </span>
        {subtitle && (
          <span className="truncate text-xs text-gray-500">{subtitle}</span>
        )}
      </div>
      <span className="shrink-0 text-sm font-semibold text-gray-900">
        {asset.asset_pricing?.currency?.symbol}
        {formatAmount(asset.asset_pricing?.amount)}
      </span>
      <Button
        type="button"
        variant="outline"
        className="h-9 w-20 shrink-0 gap-1 text-sm font-semibold text-gray-700"
        disabled={added}
        onClick={() => onAdd(asset)}
        data-testid="marketplacedevicerow-button"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Added
          </>
        ) : (
          "Add"
        )}
      </Button>
    </div>
  );
};

export default MarketplaceDeviceRow;
