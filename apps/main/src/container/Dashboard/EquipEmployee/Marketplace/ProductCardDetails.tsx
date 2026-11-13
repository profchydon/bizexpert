import Link from "next/link";
import { Truck } from "lucide-react";
import { Badge, BadgeWithFlag } from "@/components/base/badges/badges";
import { BadgeColors } from "@/components/base/badges/badge-types";
import { toBadgeFlag } from "@/components/base/badges/toBadgeFlag";

interface ProductCardDetailsProps {
  selectedCountryCode?: string;
  selectedCountryLabel?: string;
  assetState: string;
  stateBadgeColor: BadgeColors;
  pathname: string;
  assetId?: string;
  assetSpecId?: string;
  assetName?: string;
  assetSpecs?: string;
  deliveryEstimate: string;
}

const ProductCardDetails: React.FC<ProductCardDetailsProps> = ({
  selectedCountryCode,
  selectedCountryLabel,
  assetState,
  stateBadgeColor,
  pathname,
  assetId,
  assetSpecId,
  assetName,
  assetSpecs,
  deliveryEstimate,
}) => {
  const countryFlag = toBadgeFlag(selectedCountryCode);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {countryFlag && (
          <BadgeWithFlag
            type="pill-color"
            size="sm"
            color="gray"
            flag={countryFlag}
          >
            {selectedCountryLabel}
          </BadgeWithFlag>
        )}

        <Badge
          type="pill-color"
          size="sm"
          color={stateBadgeColor}
          className="font-normal"
        >
          {assetState}
        </Badge>
      </div>

      <Link
        href={{
          pathname: `${pathname}/${assetId}`,
          query: { specId: assetSpecId },
        }}
      >
        <p
          className="line-clamp-2 text-sm leading-5 font-semibold text-gray-900"
          title={`${assetName} ${assetSpecs}`}
        >
          {assetName} {assetSpecs}
        </p>
      </Link>

      <div className="flex items-center gap-1 text-gray-500">
        <Truck className="h-3.5 w-3.5 shrink-0" />
        <span className="text-xs font-medium">{deliveryEstimate}</span>
      </div>
    </div>
  );
};

export default ProductCardDetails;
