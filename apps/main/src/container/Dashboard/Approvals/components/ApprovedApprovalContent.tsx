"use client";

import Link from "next/link";
import routes from "@/routes";
import type { ApprovalRecord } from "../types";
import { formatApprovalDateTime } from "../utils";
import { ApprovalModalItems } from "./ApprovalModalItems";
import { CheckCircle } from "./UntitledIcons";

export function ApprovedApprovalContent({
  disableLinks = false,
  record,
}: {
  disableLinks?: boolean;
  record: ApprovalRecord;
}) {
  return (
    <div className="relative h-[320px] overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 blur-sm">
        <ApprovalModalItems historical record={record} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50 text-success-600">
            <CheckCircle size={22} />
          </span>
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            <ApprovedOrderTitle disableLinks={disableLinks} record={record} />
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            <ApprovedOrderDescription record={record} />
          </p>
        </div>
      </div>
    </div>
  );
}

function ApprovedOrderTitle({
  disableLinks,
  record,
}: {
  disableLinks: boolean;
  record: ApprovalRecord;
}) {
  const href = approvedOrderHref(record, disableLinks);
  if (!record.orderRef) return <>Order placed</>;

  return (
    <>
      Order{" "}
      {href ? (
        <Link
          className="rounded text-primary-700 underline decoration-primary-300 underline-offset-4 transition hover:text-primary-800 hover:decoration-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          href={href}
        >
          {record.orderRef}
        </Link>
      ) : (
        record.orderRef
      )}{" "}
      placed
    </>
  );
}

function ApprovedOrderDescription({ record }: { record: ApprovalRecord }) {
  const actor = record.actionedBy?.admin;
  const actionedAt = formatApprovalDateTime(record.actionedBy?.at);
  if (!actor) return <>The order request is locked from further changes.</>;
  return (
    <>
      Approved by <span className="font-semibold text-gray-700">{actor}</span>{" "}
      on {actionedAt}. The order request is locked from further changes.
    </>
  );
}

export function approvedOrderTitle(record: ApprovalRecord) {
  return record.orderRef ? `Order ${record.orderRef} placed` : "Order placed";
}

export function approvedOrderHref(
  record: ApprovalRecord,
  disableLinks = false,
) {
  if (disableLinks) return null;
  return record.orderId ? `${routes.ORDERS}/${record.orderId}` : null;
}

export function approvedOrderDescription(record: ApprovalRecord) {
  const actor = record.actionedBy?.admin;
  const actionedAt = formatApprovalDateTime(record.actionedBy?.at);
  if (!actor) return "The order request is locked from further changes.";
  return `Approved by ${actor} on ${actionedAt}. The order request is locked from further changes.`;
}
