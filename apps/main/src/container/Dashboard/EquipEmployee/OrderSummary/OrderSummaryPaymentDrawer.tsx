"use client";

import { useEffect } from "react";
import { Bank, CoinsHand, CreditCard02 } from "@untitledui/icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useCheckoutWalletView } from "@/components/Drawers/PaymentMethods/CreditMethod/useCheckoutWalletView";
import { canClosePaymentMethod } from "@/components/Drawers/PaymentMethods/paymentMethodRedirectUi";
import { useGetDeliverableOfficesQuery } from "@/api/baseQueries/companiesApi/officesApi/getDeliverableOffices";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { CardSchemeRow } from "./PaymentDrawer/CardSchemeRow";
import { MethodAccordionRow } from "./PaymentDrawer/MethodAccordionRow";
import { CardPanel, RaydaCreditPanel } from "./PaymentDrawer/MethodPanels";
import {
  BANK_TRANSFER_NOTE,
  CARD_UNAVAILABLE_NOTE,
  cardGatewayFee,
  formatCheckoutMoney,
  resolveBilledEntityName,
  resolveCheckoutCredit,
  resolveOpenMethod,
} from "./PaymentDrawer/checkoutMethods";

export const PAYMENT_SLIDEOUT_RESIZE = { max: 760, initial: 600 };

type OrderSummaryPaymentDrawerProps = {
  currencySymbol?: string;
  handleCardSelection: (value: string) => void;
  isFeeLoading?: boolean;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  orderOfficeIds?: string[];
  selectedCardValue?: string;
  setTabState: (value: "Card" | "Credit") => void;
  tabState: "Card" | "Credit";
  totalFee?: number;
  totalFeesArray: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
  totalItems: number;
};

export function OrderSummaryPaymentDrawer({
  currencySymbol,
  handleCardSelection,
  isFeeLoading = false,
  isLoading,
  isOpen,
  onClose,
  onSave,
  orderOfficeIds = [],
  selectedCardValue,
  setTabState,
  tabState,
  totalFee,
  totalFeesSummary,
}: OrderSummaryPaymentDrawerProps) {
  const { getCompanyDetails, getEntityMemberships } = useAuthUserDetail();
  const { activeEntityId } = useActiveWorkspace();
  const company = getCompanyDetails();
  const paymentProcessor = company?.country?.payment_processor;
  const companyId = useWorkspaceCompanyId();
  const { data: officesRes } = useGetDeliverableOfficesQuery(
    { companyId: companyId ?? "" },
    { skip: !companyId || orderOfficeIds.length === 0 },
  );
  const officeEntities = (officesRes?.data ?? [])
    .filter((office) => orderOfficeIds.includes(office.id))
    .map((office) => ({
      id: office.entity?.id ?? office.company_id,
      name: office.entity?.name,
    }));
  const entityName = resolveBilledEntityName({
    officeEntities,
    memberships: getEntityMemberships(),
    activeEntityId,
    companyName: company?.name,
  });
  const currencyCode = totalFeesSummary?.currency?.code;
  const billedTo = [entityName, currencyCode].filter(Boolean).join(", ");
  const symbol = currencySymbol ?? "";
  const total = totalFee ?? 0;
  const gatewayFee =
    tabState === "Card" ? cardGatewayFee(totalFeesSummary) : null;

  const walletView = useCheckoutWalletView();
  const credit = resolveCheckoutCredit({
    view: walletView,
    total,
    isProcure: company?.subscription?.plan?.slug === "procure",
    symbol,
  });
  const isCardAvailable = Boolean(paymentProcessor);
  const openMethod = resolveOpenMethod({
    tab: tabState,
    isCardAvailable,
    isCreditAvailable: credit.isAvailable,
  });

  useEffect(() => {
    if (paymentProcessor) handleCardSelection(paymentProcessor);
  }, [paymentProcessor]);

  useEffect(() => {
    if (isOpen && openMethod && openMethod !== tabState) {
      setTabState(openMethod);
    }
  }, [isOpen, openMethod, tabState]);

  const handleOpenChange = (open: boolean) => {
    if (!open && canClosePaymentMethod(isLoading)) onClose();
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable={!isLoading}
      resizeOptions={PAYMENT_SLIDEOUT_RESIZE}
      ariaLabel="Payment method"
    >
      {({ close }) => (
        <>
          <SlideoutMenu.Header
            onClose={isLoading ? undefined : close}
            className="pb-5"
          >
            <h2 className="text-lg font-semibold text-primary">
              Payment method
            </h2>
            <p className="text-sm text-tertiary">
              Choose how you want to pay for this order.
            </p>
          </SlideoutMenu.Header>
          <div className="h-px w-full bg-border-secondary" />
          <SlideoutMenu.Content className="gap-3 pb-6">
            <MethodAccordionRow
              icon={CreditCard02}
              title="Card"
              note={isCardAvailable ? <CardSchemeRow /> : CARD_UNAVAILABLE_NOTE}
              isDisabled={!isCardAvailable}
              isOpen={openMethod === "Card"}
              onOpen={() => setTabState("Card")}
              testId="checkout-method-card"
            >
              <CardPanel
                billedTo={billedTo}
                gatewayFee={
                  isFeeLoading
                    ? "Calculating…"
                    : gatewayFee === null
                      ? "None"
                      : formatCheckoutMoney(gatewayFee, symbol)
                }
                isLoading={isLoading}
                isDisabled={!selectedCardValue || isFeeLoading}
                onPay={onSave}
              />
            </MethodAccordionRow>

            <MethodAccordionRow
              icon={Bank}
              title="Bank transfer"
              note={BANK_TRANSFER_NOTE}
              isDisabled
              isOpen={false}
              onOpen={() => undefined}
              testId="checkout-method-bank-transfer"
              badge={
                <Tooltip
                  title="Bank transfer isn't available yet."
                  placement="top"
                >
                  <TooltipTrigger className="cursor-default">
                    <Badge size="sm" color="gray">
                      Coming soon
                    </Badge>
                  </TooltipTrigger>
                </Tooltip>
              }
            />

            <MethodAccordionRow
              icon={CoinsHand}
              title="Rayda credit"
              note={credit.note}
              isDisabled={!credit.isAvailable}
              isOpen={openMethod === "Credit"}
              onOpen={() => setTabState("Credit")}
              testId="checkout-method-credit"
            >
              <RaydaCreditPanel
                billedTo={billedTo}
                isFeeLoading={isFeeLoading}
                isLoading={isLoading}
                onPay={onSave}
                credit={credit}
                total={total}
                symbol={symbol}
              />
            </MethodAccordionRow>
          </SlideoutMenu.Content>
          <SlideoutMenu.Footer>
            <div className="flex w-full items-center justify-between gap-3">
              <span className="text-sm text-tertiary">Order total</span>
              <span className="text-lg font-semibold tabular-nums text-primary">
                {isFeeLoading
                  ? "Calculating…"
                  : formatCheckoutMoney(total, symbol)}
              </span>
            </div>
          </SlideoutMenu.Footer>
        </>
      )}
    </SlideoutMenu>
  );
}
