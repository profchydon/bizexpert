import React from "react";
import EmptyInstance from "./EmptyInstance";
import formatAmount from "@/utils/formatAmount";
import TotalFeeSummary from "../TotalFeeSummary";
import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import { checkoutWalletUsedPercent } from "./mapCheckoutWallet";
import {
  DELEGATED_WALLET_NOTE,
  MASKED_WALLET_AMOUNT,
} from "./isDelegatedCheckoutBilling";
import CheckoutWalletCard from "./CheckoutWalletCard";
import { useCheckoutWalletView } from "./useCheckoutWalletView";

interface Props {
  totalItems: number;
  currencySymbol: string;
  totalFee: number;
  totalFeesArray: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
}

const CreditMethod: React.FC<Props> = ({
  currencySymbol,
  totalFee,
  totalFeesArray,
  totalFeesSummary,
  totalItems,
}) => {
  const view = useCheckoutWalletView();

  return (
    <div className="h-screen pt-6 flex flex-col">
      {view.kind === "loading" ? (
        <p className="text-sm text-gray-600">Loading credit balance…</p>
      ) : null}
      {view.kind === "empty" ? <EmptyInstance /> : null}
      {view.kind === "delegated" ? (
        <CheckoutWalletCard
          currencySymbol={currencySymbol}
          available={MASKED_WALLET_AMOUNT}
          limit={MASKED_WALLET_AMOUNT}
          usedPercent={0}
          note={DELEGATED_WALLET_NOTE}
        />
      ) : null}
      {view.kind === "own" ? (
        <CheckoutWalletCard
          currencySymbol={currencySymbol}
          available={formatAmount(view.wallet.available)}
          limit={formatAmount(view.wallet.limit)}
          usedPercent={checkoutWalletUsedPercent(view.wallet)}
        />
      ) : null}
      <TotalFeeSummary
        currencySymbol={currencySymbol!}
        totalEquipment={totalItems!}
        totalFee={totalFee}
        totalFeesArray={totalFeesArray}
        totalFeesSummary={totalFeesSummary}
      />
    </div>
  );
};

export default CreditMethod;
