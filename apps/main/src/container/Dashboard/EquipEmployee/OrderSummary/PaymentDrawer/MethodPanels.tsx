"use client";

import { AlertTriangle, InfoCircle } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import { Button } from "@/components/base/buttons/button";
import { MASKED_WALLET_AMOUNT } from "@/components/Drawers/PaymentMethods/CreditMethod/isDelegatedCheckoutBilling";
import { PaymentFactList } from "./PaymentFactList";
import { type CheckoutCredit, formatCheckoutMoney } from "./checkoutMethods";

interface PanelProps {
  billedTo: string;
  isLoading: boolean;
  onPay: () => void;
}

export function CardPanel({
  billedTo,
  gatewayFee,
  isLoading,
  isDisabled,
  onPay,
}: PanelProps & { gatewayFee: string; isDisabled: boolean }) {
  return (
    <>
      <PaymentFactList
        facts={[
          { id: "by", label: "Paid by", value: billedTo },
          { id: "fee", label: "Card processing fee", value: gatewayFee },
          { id: "when", label: "Clears in", value: "Immediately" },
        ]}
      />
      <Banner
        tone="info"
        icon={InfoCircle}
        title="Your order moves straight to processing"
        description="The card is charged now, including the card processing fee, so procurement starts without waiting for funds to clear."
      />
      <Button
        size="md"
        className="w-full"
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={onPay}
        data-testid="methodpanels-button"
      >
        {isLoading ? "Redirecting…" : "Pay by card"}
      </Button>
    </>
  );
}

export function RaydaCreditPanel({
  billedTo,
  isFeeLoading,
  isLoading,
  onPay,
  credit,
  total,
  symbol,
}: PanelProps & {
  credit: CheckoutCredit;
  isFeeLoading: boolean;
  total: number;
  symbol: string;
}) {
  return (
    <>
      <PaymentFactList
        facts={[
          { id: "by", label: "Paid by", value: billedTo },
          {
            id: "bal",
            label: "Available credit",
            value:
              credit.available === null
                ? MASKED_WALLET_AMOUNT
                : formatCheckoutMoney(credit.available, symbol),
          },
          {
            id: "due",
            label: "This order",
            value: isFeeLoading
              ? "Calculating…"
              : formatCheckoutMoney(total, symbol),
          },
        ]}
      />
      {credit.isShort ? (
        <Banner
          tone="warning"
          icon={AlertTriangle}
          title="Your credit does not cover this order"
          description={`You are ${formatCheckoutMoney(credit.shortfall, symbol)} short. Pay this order another way.`}
        />
      ) : (
        <Banner
          tone="info"
          icon={InfoCircle}
          title="Paid from your Rayda credit"
          description="No card is charged and nothing needs to clear."
        />
      )}
      <Button
        size="md"
        className="w-full"
        isDisabled={credit.isShort || !credit.isAvailable || isFeeLoading}
        isLoading={isLoading}
        onClick={onPay}
        data-testid="methodpanels-button-2"
      >
        {isLoading ? "Redirecting…" : "Pay from Rayda credit"}
      </Button>
    </>
  );
}
