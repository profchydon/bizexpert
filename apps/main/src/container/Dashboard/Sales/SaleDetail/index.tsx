"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PageState from "@/components/PageState";
import { DataTable } from "@/components/ui/data-table";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Sale } from "@/types/bizexpert";
import { AddPaymentSlideout } from "../AddPaymentSlideout";
import { CancelSaleModal } from "../CancelSaleModal";
import { downloadSaleInvoice } from "../downloadSaleInvoice";
import { RefundSaleModal } from "../RefundSaleModal";
import type { CancelSaleValues, RefundSaleValues } from "../saleActionSchemas";
import { readSalesApiError } from "../salesApiError";
import {
  salesPageSectionClass,
  salesTableShellClass,
} from "../salesPageClasses";
import { salesQueryKeys } from "../salesQueryKeys";
import { ShareWhatsappSlideout } from "../ShareWhatsappSlideout";
import { saleItemColumns } from "./itemColumns";
import { salePaymentColumns } from "./paymentColumns";
import { SaleDetailActions } from "./SaleDetailActions";
import { SaleSummary } from "./SaleSummary";

type Panel = "pay" | "share" | "cancel" | "refund" | null;

export default function SaleDetail() {
  const { id } = useParams<{ id: string }>();
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const { push, isPending } = useTransitionRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [downloading, setDownloading] = useState(false);

  const {
    data: sale,
    isLoading,
    isError,
  } = useQuery({
    queryKey: salesQueryKeys.detail(businessId ?? "", id),
    enabled: !!businessId && !!id,
    queryFn: async () =>
      (await bizexpertApi.get(`/businesses/${businessId}/sales/${id}`))
        .data as Sale,
  });

  const cancelSale = useMutation({
    mutationFn: async (values: CancelSaleValues) => {
      await bizexpertApi.post(
        `/businesses/${businessId}/sales/${id}/cancel`,
        values,
      );
    },
    onSuccess: async () => {
      toast.success("Sale cancelled");
      setPanel(null);
      await qc.invalidateQueries({ queryKey: ["sale"] });
      await qc.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (err) => toast.error(readSalesApiError(err, "Cancel failed")),
  });

  const refundSale = useMutation({
    mutationFn: async (values: RefundSaleValues) => {
      await bizexpertApi.post(`/businesses/${businessId}/sales/${id}/refund`, {
        reason: values.reason,
        returnGoods: Boolean(values.returnGoods),
      });
    },
    onSuccess: async () => {
      toast.success("Sale refunded");
      setPanel(null);
      await qc.invalidateQueries({ queryKey: ["sale"] });
      await qc.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (err) => toast.error(readSalesApiError(err, "Refund failed")),
  });

  const onInvoice = async () => {
    if (!businessId || !sale) return;
    setDownloading(true);
    try {
      await downloadSaleInvoice(businessId, sale.id, sale.saleNumber);
    } catch (err) {
      toast.error(readSalesApiError(err, "Invoice download failed"));
    } finally {
      setDownloading(false);
    }
  };

  if (!businessId) {
    return <p className="py-8 text-secondary">No business selected.</p>;
  }

  return (
    <section className={salesPageSectionClass}>
      <PageHeader
        pageTitle={sale?.saleNumber ?? "Sale"}
        pageDescription="Items, payments, invoice, and WhatsApp share."
        breadCrumbs={["Sales", sale?.saleNumber ?? "Sale"]}
      >
        {sale ? (
          <SaleDetailActions
            sale={sale}
            isDownloading={downloading}
            isBackPending={isPending}
            onBack={() => push("/dashboard/sales")}
            onInvoice={onInvoice}
            onShare={() => setPanel("share")}
            onPay={() => setPanel("pay")}
            onCancel={() => setPanel("cancel")}
            onRefund={() => setPanel("refund")}
          />
        ) : null}
      </PageHeader>
      <PageState isLoading={isLoading} isError={isError}>
        {sale ? (
          <div className="space-y-6">
            {sale.cancelReason ? (
              <p className="text-sm text-gray-600">
                Reason: {sale.cancelReason}
              </p>
            ) : null}
            <SaleSummary sale={sale} />
            <div className={salesTableShellClass}>
              <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
                Items
              </h3>
              <DataTable
                data={sale.saleItems ?? []}
                columns={saleItemColumns()}
              />
            </div>
            <div className={salesTableShellClass}>
              <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
                Payments
              </h3>
              <DataTable
                data={sale.payments ?? []}
                columns={salePaymentColumns()}
              />
            </div>
          </div>
        ) : null}
      </PageState>
      {sale && panel === "pay" ? (
        <AddPaymentSlideout isOpen sale={sale} onClose={() => setPanel(null)} />
      ) : null}
      {sale && panel === "share" ? (
        <ShareWhatsappSlideout
          isOpen
          sale={sale}
          onClose={() => setPanel(null)}
        />
      ) : null}
      {sale && panel === "cancel" ? (
        <CancelSaleModal
          isOpen
          sale={sale}
          isSubmitting={cancelSale.isPending}
          onClose={() => setPanel(null)}
          onConfirm={(values) => cancelSale.mutate(values)}
        />
      ) : null}
      {sale && panel === "refund" ? (
        <RefundSaleModal
          isOpen
          sale={sale}
          isSubmitting={refundSale.isPending}
          onClose={() => setPanel(null)}
          onConfirm={(values) => refundSale.mutate(values)}
        />
      ) : null}
    </section>
  );
}
