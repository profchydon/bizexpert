"use client";

import type { ApprovalRecord } from "../types";
import { formatApprovalMoney } from "../utils";
import { ItemSourceBadge, TierBadge } from "./Badges";
import { CategoryPill, ItemThumb } from "./ApprovalModalParts";
import { Repeat04 } from "./UntitledIcons";

const dash = "-";

export function ApprovalModalItems({
  historical,
  onSwap,
  record,
}: {
  historical: boolean;
  onSwap?: (item: ApprovalRecord["items"][number]) => void;
  record: ApprovalRecord;
}) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Items</h3>
          <span className="text-xs text-gray-500">
            {record.items.length} {record.items.length === 1 ? "item" : "items"}
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          {record.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <ItemThumb item={item} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-normal text-gray-900">
                  {item.name ?? dash}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <CategoryPill>{item.category ?? dash}</CategoryPill>
                  <TierBadge tier={item.tier} />
                  {item.source ? (
                    <ItemSourceBadge source={item.source} />
                  ) : (
                    <span className="text-xs text-gray-500">{dash}</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {item.quantity == null ? dash : `Qty ${item.quantity}`}
                  </span>
                  {item.leadTimeDays == null ? null : (
                    <span className="text-xs text-gray-500">
                      {item.leadTimeDays}{" "}
                      {item.leadTimeDays === 1 ? "day" : "days"} lead time
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatApprovalMoney({
                  amount: item.amount,
                  currencyCode: record.currencyCode,
                  currencySymbol: record.currencySymbol,
                })}
              </span>
              {record.allowItemSwap && !historical ? (
                <button
                  type="button"
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                  onClick={() => onSwap?.(item)}
                >
                  <Repeat04 size={16} className="text-gray-400" />
                  Swap
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-6 py-4 md:px-8">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className="text-base font-semibold text-gray-900">
          {formatApprovalMoney({
            amount: record.totalAmount,
            currencyCode: record.currencyCode,
            currencySymbol: record.currencySymbol,
          })}
        </span>
      </div>
    </>
  );
}
