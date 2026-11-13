import type { ApprovalItem } from "../types";
import type { ApprovalSwapDraft, SwapCandidate } from "../swapUtils";
import { formatApprovalMoney } from "../utils";
import { ItemSourceBadge } from "./Badges";
import { CategoryPill, ItemThumb } from "./ApprovalModalParts";
import { Switch } from "@/components/ui/switch";
import Pagination from "@/components/Custom/Pagination";

type SwapAcknowledgements = Pick<
  ApprovalSwapDraft,
  | "acknowledgeBudgetWarning"
  | "acknowledgeCategoryChange"
  | "acknowledgeExistingItem"
  | "acknowledgeOutsideKitScope"
>;

export function CurrentSwapItem({ item }: { item: ApprovalItem }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Currently assigned
      </p>
      <div className="mt-2 flex items-center gap-3">
        <ItemThumb item={item} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {item.name ?? "-"}
          </p>
          <p className="text-xs text-gray-500">{item.category ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}

export function SwapOption({
  currentAmount,
  item,
  onSelect,
  selected,
}: {
  currentAmount?: number;
  item: SwapCandidate;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  const delta =
    item.amount == null || currentAmount == null
      ? undefined
      : item.amount - currentAmount;

  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(item.id)}
        className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
          selected
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <ItemThumb
          item={{
            id: item.id,
            category: item.category,
            imageUrl: item.imageUrl,
            name: item.name,
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{item.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CategoryPill>{item.category ?? "-"}</CategoryPill>
            <ItemSourceBadge source="MARKETPLACE" />
            {item.leadTimeLabel ? (
              <span className="text-xs text-gray-500">
                {item.leadTimeLabel}
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatApprovalMoney({
              amount: item.amount,
              currencySymbol: item.currencySymbol,
            })}
          </p>
          {delta == null ? null : (
            <p
              className={`text-xs ${
                delta > 0 ? "text-error-600" : "text-success-600"
              }`}
            >
              {delta > 0 ? "+" : ""}
              {formatApprovalMoney({
                amount: delta,
                currencySymbol: item.currencySymbol,
              })}
            </p>
          )}
        </div>
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-primary-600">
          {selected ? (
            <span className="h-2 w-2 rounded-full bg-primary-600" />
          ) : null}
        </span>
      </button>
    </li>
  );
}

export function SwapAcknowledgementToggles({
  onChange,
  values,
}: {
  onChange: (key: keyof SwapAcknowledgements, value: boolean) => void;
  values: SwapAcknowledgements;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Acknowledgements
      </p>
      <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
        {acknowledgementOptions.map((option) => (
          <label
            key={option.key}
            className="flex items-start justify-between gap-3 rounded-lg bg-white p-3"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-gray-900">
                {option.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-gray-500">
                {option.description}
              </span>
            </span>
            <Switch
              checked={values[option.key]}
              onCheckedChange={(checked) => onChange(option.key, checked)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function SwapOptionsPagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination
      currentPage={currentPage}
      lastPage={lastPage}
      onPageChange={onPageChange}
      className="border-t border-gray-200 bg-white px-6 py-3"
      buttonClassName="h-9 px-3"
    />
  );
}

const acknowledgementOptions: {
  key: keyof SwapAcknowledgements;
  label: string;
  description: string;
}[] = [
  {
    key: "acknowledgeCategoryChange",
    label: "Category change",
    description: "Confirm the replacement is in a different category.",
  },
  {
    key: "acknowledgeOutsideKitScope",
    label: "Outside kit scope",
    description: "Confirm the replacement comes from marketplace assets.",
  },
  {
    key: "acknowledgeBudgetWarning",
    label: "Budget warning",
    description: "Confirm this swap can continue even if it exceeds budget.",
  },
  {
    key: "acknowledgeExistingItem",
    label: "Existing item",
    description: "Confirm this replacement may duplicate an existing item.",
  },
];
