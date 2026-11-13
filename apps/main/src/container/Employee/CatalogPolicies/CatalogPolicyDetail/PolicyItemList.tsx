import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OpenPolicyItemGroups from "./OpenPolicyItemGroups";
import PolicyItemCard from "./PolicyItemCard";
import {
  addPolicyCartItem,
  filterPolicyItemsByRequirement,
  reducePolicyCartItem,
  type PolicyCart,
  type PolicyDisplayItem,
  type RequirementFilter,
} from "./utils";
import type { OpenSelectionGroup } from "./selectionConfigGroups";

const REQUIREMENT_FILTERS: { label: string; value: RequirementFilter }[] = [
  { label: "All", value: "all" },
  { label: "Required", value: "required" },
  { label: "Optional", value: "optional" },
];

type Props = {
  cart: PolicyCart;
  approvedOrderMessage: string;
  hasApprovedOrder: boolean;
  hasPendingOrder: boolean;
  isOpenPolicy: boolean;
  isCheckingPendingOrder: boolean;
  items: PolicyDisplayItem[];
  openGroups: OpenSelectionGroup[];
  pendingOrderMessage: string;
  setCart: Dispatch<SetStateAction<PolicyCart>>;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  totalItems: number;
};

const PolicyItemList = ({
  approvedOrderMessage,
  cart,
  hasApprovedOrder,
  hasPendingOrder,
  isOpenPolicy,
  isCheckingPendingOrder,
  items,
  openGroups,
  pendingOrderMessage,
  setCart,
  setCartOpen,
  totalItems,
}: Props) => {
  const [requirementFilter, setRequirementFilter] =
    useState<RequirementFilter>("all");
  const filteredItems = useMemo(
    () => filterPolicyItemsByRequirement(items, requirementFilter),
    [items, requirementFilter],
  );

  if (!items.length) {
    return (
      <EmptyTableInstance
        description="No kit items were returned for this catalog policy."
        title="No policy items yet"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isOpenPolicy ? (
          <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700">
            Choose items based on the configured category limits.
          </p>
        ) : (
          <FilterTabs
            requirementFilter={requirementFilter}
            setRequirementFilter={setRequirementFilter}
          />
        )}
        <div className="flex flex-wrap items-center gap-2">
          {!isOpenPolicy ? (
            <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700">
              Required items are automatically added to cart.
            </p>
          ) : null}
          {hasApprovedOrder ? (
            <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm font-medium text-warning-700">
              {approvedOrderMessage}
            </p>
          ) : hasPendingOrder ? (
            <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm font-medium text-warning-700">
              {pendingOrderMessage}
            </p>
          ) : isCheckingPendingOrder ? (
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600">
              Checking pending order status...
            </p>
          ) : totalItems > 0 ? (
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-lg px-4 text-sm font-semibold"
              onClick={() => setCartOpen(true)}
              data-testid="policyitemlist-button"
            >
              Checkout
            </Button>
          ) : null}
        </div>
      </div>

      {isOpenPolicy ? (
        <OpenPolicyItemGroups
          cart={cart}
          groups={openGroups}
          hasApprovedOrder={hasApprovedOrder}
          items={items}
          setCart={setCart}
        />
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <PolicyItemCard
              key={item.id}
              item={item}
              hideActions={hasApprovedOrder}
              selectedQuantity={cart[item.id] ?? 0}
              onAdd={() =>
                setCart((currentCart) =>
                  addPolicyCartItem(currentCart, item.id, item.quantity),
                )
              }
              onRemove={() =>
                setCart((currentCart) =>
                  reducePolicyCartItem(currentCart, item.id),
                )
              }
            />
          ))}
        </div>
      ) : (
        <EmptyTableInstance
          description="No items match this filter."
          title="No items found"
        />
      )}
    </div>
  );
};

function FilterTabs({
  requirementFilter,
  setRequirementFilter,
}: {
  requirementFilter: RequirementFilter;
  setRequirementFilter: Dispatch<SetStateAction<RequirementFilter>>;
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      {REQUIREMENT_FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition",
            requirementFilter === filter.value &&
              "bg-white text-gray-900 shadow-sm",
          )}
          onClick={() => setRequirementFilter(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default PolicyItemList;
