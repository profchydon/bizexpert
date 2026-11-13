"use client";

import { FileCheck02 } from "@untitledui/icons";
import { useGetSubscriptionInvoiceQuery } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import type { SubscriptionBillingInvoice } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { invoiceOnScreen, invoiceStatusLabel } from "./billingInvoices";
import { formatBillingDate } from "./subscriptionView";

function DeviceLine({
  label,
  count,
  rate,
}: {
  label: string;
  count: number;
  rate: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-tertiary">{label}</span>
      <span className="text-secondary tabular-nums">
        {count} × {rate || "—"}
      </span>
    </div>
  );
}

export function BillingInvoiceModal({
  companyId,
  invoice,
  downloadUrl,
  onClose,
}: {
  companyId?: string;
  invoice: SubscriptionBillingInvoice | null;
  downloadUrl: string | null;
  onClose: () => void;
}) {
  const detail = useGetSubscriptionInvoiceQuery(
    { companyId, invoiceId: invoice?.id ?? "" },
    { skip: !companyId || !invoice?.id },
  );
  const viewed = invoiceOnScreen(invoice, detail.data?.data);
  if (!viewed) return null;
  const when = formatBillingDate(viewed.billed_on) || "an unknown date";
  const plan = viewed.plan?.name ? `Rayda ${viewed.plan.name}` : "This plan";

  return (
    <ModalOverlay
      isOpen
      isDismissable
      onOpenChange={(next) => !next && onClose()}
      className="z-[1003]"
    >
      <Modal className="z-[1003] max-w-lg">
        <Dialog data-testid="billinginvoicemodal-dialog">
          <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <FeaturedIcon
                icon={FileCheck02}
                size="md"
                color="success"
                theme="light"
              />
              <CloseButton size="sm" onPress={onClose} />
            </div>
            <h3 className="mt-4 text-md font-semibold text-primary">
              {viewed.number}
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              {plan}, billed on {when}. Status{" "}
              {invoiceStatusLabel(viewed.status)}.
            </p>
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-secondary bg-secondary p-4">
              {viewed.devices ? (
                <>
                  <DeviceLine
                    label="Company devices"
                    count={viewed.devices.company.count}
                    rate={viewed.devices.company.rate_display}
                  />
                  <DeviceLine
                    label="Employee owned devices"
                    count={viewed.devices.byod.count}
                    rate={viewed.devices.byod.rate_display}
                  />
                  <div className="h-px w-full bg-border-secondary" />
                </>
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-primary">
                  Amount
                </span>
                <span className="text-lg font-semibold text-primary tabular-nums">
                  {viewed.amount_display || "—"}
                </span>
              </div>
            </div>
            {detail.isError ? (
              <p className="mt-3 text-xs text-tertiary">
                The full invoice could not be loaded.
              </p>
            ) : null}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                color="secondary"
                size="md"
                className="w-full"
                onPress={onClose}
                data-testid="billinginvoicemodal-button"
              >
                Close
              </Button>
              <Button
                color="primary"
                size="md"
                className="w-full"
                href={downloadUrl ?? undefined}
                target="_blank"
                isDisabled={!downloadUrl}
                data-testid="billinginvoicemodal-button-2"
              >
                Download
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
