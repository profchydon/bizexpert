import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import type { FC } from "react";
import { OrderSummaryPaymentDrawer } from "@/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryPaymentDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedCardValue?: string;
  handleCardSelection?: (value: string) => void;
  tabState: string;
  setTabState: (value: "Card" | "Credit") => void;
  isLoading: boolean;
  isFeeLoading?: boolean;
  isOffboarding?: boolean;
  totalItems?: number;
  totalFee?: number;
  currencySymbol?: string;
  totalFeesArray?: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
  orderOfficeIds?: string[];
}

const PaymentMethods: FC<Props> = ({
  handleCardSelection,
  isFeeLoading,
  isOffboarding: _isOffboarding,
  totalItems = 0,
  totalFee,
  currencySymbol,
  totalFeesArray = [],
  orderOfficeIds,
  tabState,
  ...rest
}) => (
  <OrderSummaryPaymentDrawer
    {...rest}
    tabState={tabState === "Credit" ? "Credit" : "Card"}
    handleCardSelection={handleCardSelection ?? (() => undefined)}
    isFeeLoading={isFeeLoading}
    totalItems={totalItems}
    totalFee={totalFee}
    currencySymbol={currencySymbol}
    totalFeesArray={totalFeesArray}
    orderOfficeIds={orderOfficeIds}
  />
);

export default PaymentMethods;
