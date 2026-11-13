"use client";

import { useSearchParams } from "next/navigation";
import { usePlansQuery } from "@/api/baseQueries/plansApi/plans";
import {
  useGetSubscriptionContractQuery,
  useVerifySubscriptionPlanChangeQuery,
} from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import PageState from "@/components/PageState";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { AvailablePlans } from "./AvailablePlans";
import { BillingHistoryCard } from "./BillingHistoryCard";
import { CurrentPlanSummary } from "./CurrentPlanSummary";
import PaymentErrorInstanceModal from "./PaymentErrorInstance";
import PaymentSuccessInstanceModal from "./PaymentSuccessInstance";
import { PlanChangeModal } from "./PlanChangeModal";
import { parsePlanCatalog } from "./catalog";
import { downgradeBlocks, officeLimitLabel } from "./entitlementAccess";
import { limitUsageRows } from "./limitUsageRows";
import { useCompanyEntitlements } from "./useCompanyEntitlements";
import { formatCharge, formatPlanRate } from "./subscriptionMoney";
import { subscriptionScreen } from "./subscriptionScreen";
import {
  baseRate,
  highlightDelta,
  isFreePlan,
  monthlyWorking,
  officeLabel,
  summaryTotal,
} from "./subscriptionView";
import { useSubscriptionDeviceCount } from "./useSubscriptionDeviceCount";
import {
  rememberedSubscriptionTxRef,
  subscriptionReturnQuery,
} from "./subscriptionRedirect";
import { useSubscriptionCheckout } from "./useSubscriptionCheckout";
import { useSubscriptionReturn } from "./useSubscriptionReturn";

const Subscription = () => {
  const searchParams = useSearchParams();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const returned = subscriptionReturnQuery(searchParams.toString());
  const txRef = returned.txRef || rememberedSubscriptionTxRef();
  const canceled = returned.status === "canceled";
  const verify = useVerifySubscriptionPlanChangeQuery(
    { companyId: company?.id, txRef: returned.txRef ?? "" },
    { skip: !returned.txRef || !company?.id || canceled },
  );
  const payment = useSubscriptionReturn({
    txRef: returned.txRef,
    successInstance: searchParams.get("success_instance"),
    errorInstance: searchParams.get("error_instance"),
    verified: Boolean(verify.data),
    verifyError: verify.isError || canceled,
  });
  const checkout = useSubscriptionCheckout();
  const subscriptionQuery = useGetSubscriptionContractQuery(
    { companyId: company?.id },
    { skip: !company?.id },
  );
  const entitlements = useCompanyEntitlements();
  const plansQuery = usePlansQuery();
  const contract = subscriptionQuery.data?.data;
  const catalog = parsePlanCatalog(plansQuery.data);
  const devices = useSubscriptionDeviceCount(company?.id, catalog.plans);
  const screen = subscriptionScreen(contract, catalog);
  const current = screen.current ?? screen.freePlan;
  const { currency, freePlan, settleBy, scheduled, notice } = screen;

  return (
    <PageState
      isError={subscriptionQuery.isError || plansQuery.isError}
      isLoading={
        subscriptionQuery.isLoading || plansQuery.isLoading || devices.pending
      }
    >
      {current && (
        <div className="flex flex-col gap-6">
          <CurrentPlanSummary
            name={`Rayda ${current.name}`}
            tagline={current.tagline}
            total={summaryTotal(current, currency)}
            working={
              isFreePlan(current)
                ? "forever"
                : `${monthlyWorking(current, currency, devices.count)}, monthly`
            }
            renewLabel={
              contract?.status === "past_due" ? "Settle by" : "Renews on"
            }
            renewValue={
              isFreePlan(current) && contract?.status === "active"
                ? "Not billed"
                : settleBy || "Not billed"
            }
            offices={
              officeLimitLabel(entitlements.find("office_limit")) ??
              officeLabel(catalog.groups, current.slug)
            }
            usage={limitUsageRows(entitlements.items)}
            banner={notice}
            companyId={company?.id}
            txRef={txRef}
            onSettle={() => {
              document
                .getElementById("available-plans")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            onResubscribe={() => {
              if (screen.resubscribe)
                checkout.open(screen.resubscribe, "upgrade");
            }}
          />
          <div id="available-plans">
            <AvailablePlans
              catalog={catalog}
              current={current}
              currency={currency}
              devices={devices.count}
              scheduledSlug={scheduled?.plan?.slug ?? null}
              onSelect={checkout.open}
            />
          </div>
          <BillingHistoryCard
            companyId={company?.id}
            isFree={isFreePlan(current)}
            freePlanName={freePlan?.name ?? current.name}
          />
        </div>
      )}
      <PlanChangeModal
        open={Boolean(checkout.target)}
        mode={checkout.mode}
        planName={checkout.target?.name ?? ""}
        currentName={current?.name ?? ""}
        rateLabel={
          !checkout.target || isFreePlan(checkout.target)
            ? "Free"
            : `${formatPlanRate(baseRate(checkout.target, currency), currency)} /device/mo`
        }
        devices={devices.count}
        total={
          checkout.target
            ? devices.count > 0
              ? summaryTotal(checkout.target, currency)
              : formatCharge(0, currency)
            : ""
        }
        startsOn={settleBy || "your next renewal"}
        description={
          checkout.mode === "upgrade"
            ? `${checkout.target?.name ?? "This plan"} starts as soon as your payment clears. You are billed for it every month from then on.`
            : `Nothing is charged today. ${checkout.target?.name ?? "This plan"} starts on ${settleBy || "your next renewal"}.`
        }
        features={
          checkout.target && current
            ? highlightDelta(
                catalog.plans,
                current,
                checkout.target,
                checkout.mode,
              )
            : []
        }
        isLoading={checkout.isLoading}
        canPay={Boolean(checkout.target?.id)}
        blockers={
          checkout.mode === "downgrade" && checkout.target
            ? downgradeBlocks(
                entitlements.items,
                catalog.groups,
                checkout.target.slug,
              )
            : []
        }
        onClose={checkout.close}
        onConfirm={() => checkout.confirm(checkout.target?.id ?? "")}
      />
      <PaymentSuccessInstanceModal
        isOpen={payment.successOpen}
        onClose={payment.closeSuccess}
        onProceed={payment.closeSuccess}
        planName={current?.name}
        renewsOn={settleBy}
      />
      <PaymentErrorInstanceModal
        isOpen={Boolean(searchParams.get("error_instance"))}
        onClose={payment.clearError}
      />
    </PageState>
  );
};

export default Subscription;
