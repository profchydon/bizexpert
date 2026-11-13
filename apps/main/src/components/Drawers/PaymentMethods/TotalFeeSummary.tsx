import { InclusiveTaxNote } from "@/components/Tax/InclusiveTaxNote";
import CheckoutFeeRows from "@/components/Tax/CheckoutFeeRows";
import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import formatAmount from "@/utils/formatAmount";

interface Props {
  currencySymbol: string;
  totalFee: number;
  totalFeesArray: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
  totalEquipment: number;
}
const TotalFeeSummary: React.FC<Props> = ({
  currencySymbol,
  totalEquipment,
  totalFeesArray,
  totalFeesSummary,
  totalFee,
}) => {
  return (
    <div className="w-full mt-5">
      <div className="border-b border-border-secondary py-4 flex flex-row items-center justify-between">
        <span className="text-sm font-medium">Items</span>
        <span className="text-sm font-medium">{totalEquipment ?? 0}</span>
      </div>

      <CheckoutFeeRows
        rows={totalFeesArray}
        currencySymbol={currencySymbol}
        feeSummary={totalFeesSummary}
        rowClassName="border-b border-border-secondary py-4 flex flex-row items-center justify-between gap-4"
        labelClassName="text-sm font-medium"
        valueClassName="shrink-0 tabular-nums text-sm font-medium"
      />

      <div className="py-4 flex flex-row items-center justify-between gap-4">
        <span className="text-lg font-bold">
          Sub Total <InclusiveTaxNote />
        </span>
        <span className="shrink-0 tabular-nums text-lg font-bold">
          {currencySymbol}
          {formatAmount(totalFee ?? 0)}
        </span>
      </div>
    </div>
  );
};

export default TotalFeeSummary;
