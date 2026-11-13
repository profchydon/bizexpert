"use client";

import { useEffect, useState } from "react";
import {
  useLazyGetCancellationPreviewQuery,
  type CancellationPreviewResponse,
} from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import type { CancellationReasonId } from "@/utils/order-cancellation";
import { currencyPrefix } from "@/utils/refund-preview";
import { cancellableItems } from "./cancelData";
import {
  type CancelOrderModalArgs,
  cancelModalPreview,
  modalCancelScope,
} from "./cancelModalView";
import {
  cancellationScopeForLines,
  cancellableLineIds,
  cancelRequestIds,
  lineSelectionState,
} from "./cancelLineSelection";

export function useCancelOrderModal({
  order,
  companyId,
  intent,
  employees,
  isPreAccept: isPreAcceptProp,
  onSubmit,
}: CancelOrderModalArgs) {
  const [step, setStep] = useState<"form" | "commit" | "done">("form");
  const [reasonId, setReasonId] = useState<CancellationReasonId | null>(null);
  const [details, setDetails] = useState("");
  const [doneInstant, setDoneInstant] = useState<boolean | null>(null);
  const [pickedKey, setPickedKey] = useState<string | null>(null);
  const [previewData, setPreviewData] =
    useState<CancellationPreviewResponse | null>(null);
  const [fetchPreview, { isFetching }] = useLazyGetCancellationPreviewQuery();
  const selectableLineIds = cancellableLineIds(employees, intent);
  const selectableKey = selectableLineIds.join(",");
  const selectedLineIds =
    pickedKey === null
      ? selectableLineIds
      : pickedKey
        ? pickedKey.split(",")
        : [];
  const selectionKey = selectedLineIds.join(",");

  useEffect(() => {
    setPickedKey(null);
  }, [selectableKey]);

  const prefix = currencyPrefix(order.currency);
  const item =
    intent.type === "item"
      ? employees
          .flatMap((employee) => employee.items)
          .find((candidate) => candidate.id === intent.itemId)
      : undefined;
  const selectedIds = new Set(
    intent.type === "sub-orders" ? intent.employeeIds : [],
  );
  const eligible = employees.filter(
    (employee) =>
      employee.status !== "cancelled" &&
      cancellableItems(employee.items).length > 0,
  );
  const blocked = employees.filter(
    (employee) =>
      employee.status !== "cancelled" &&
      cancellableItems(employee.items).length === 0,
  );
  const coversEverything =
    blocked.length === 0 &&
    eligible.length > 0 &&
    selectedIds.size >= eligible.length;
  const scope = cancellationScopeForLines({
    intent,
    itemId: item?.id,
    coversEverything,
    employeeIds: [...selectedIds],
    selectable: selectableLineIds,
    selected: selectedLineIds,
  });

  useEffect(() => {
    if (!companyId || step === "done") return;
    const ids = cancelRequestIds(employees, selectedLineIds);
    if (!ids.suborderIds?.length) {
      setPreviewData(null);
      return;
    }
    let active = true;
    fetchPreview({
      companyId,
      orderId: order.id,
      employeeIds: ids.employeeIds,
      suborderIds: ids.suborderIds,
    })
      .unwrap()
      .then((response) => {
        if (active) setPreviewData(response.data);
      })
      .catch(() => {
        if (active) setPreviewData(null);
      });
    return () => {
      active = false;
    };
  }, [companyId, employees, fetchPreview, order.id, selectionKey, step]);

  const isPreAccept =
    step === "done" && doneInstant !== null
      ? doneInstant
      : (previewData?.instant ?? isPreAcceptProp);
  const cancelScope = modalCancelScope({
    order,
    employees,
    intent,
    item,
    scope,
    selectedIds,
    selectedLineIds,
    previewData,
  });
  const { preview, consequence } = cancelModalPreview({
    order,
    previewData,
    cancelScope,
    prefix,
    scope,
    isPreAccept,
  });
  const requestIds = cancelRequestIds(employees, selectedLineIds);

  const submit = async () => {
    if (!reasonId || selectedLineIds.length === 0) return;
    const result = await onSubmit({
      scope,
      reasonId,
      details,
      employeeIds: requestIds.employeeIds,
      suborderIds: requestIds.suborderIds,
    });
    if (!result.ok) return;
    if (result.refund_preview && previewData) {
      setPreviewData({
        ...previewData,
        instant: result.instant ?? previewData.instant,
        refund_preview: result.refund_preview,
      });
    }
    setDoneInstant(result.instant ?? previewData?.instant ?? isPreAcceptProp);
    setStep("done");
  };

  return {
    step,
    setStep,
    reasonId,
    setReasonId,
    details,
    setDetails,
    scope,
    prefix,
    item,
    cancelScope,
    preview,
    consequence,
    isPreAccept,
    requiresTypeToConfirm:
      previewData?.requires_type_to_confirm ?? isPreAcceptProp,
    canContinue: reasonId !== null && !isFetching && selectedLineIds.length > 0,
    lineSelection: {
      state: lineSelectionState(selectableLineIds, selectedLineIds),
      onToggleLine: (lineId: string, checked: boolean) => {
        const next = checked
          ? selectedLineIds.includes(lineId)
            ? selectedLineIds
            : [...selectedLineIds, lineId]
          : selectedLineIds.filter((id) => id !== lineId);
        setPickedKey(next.join(","));
      },
      onToggleAll: (checked: boolean) => {
        setPickedKey(checked ? selectableKey : "");
      },
    },
    submit,
    isOffboarding: order.type === "offboarding",
  };
}
