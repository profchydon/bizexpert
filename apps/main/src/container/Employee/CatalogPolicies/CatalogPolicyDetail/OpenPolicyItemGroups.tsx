import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { cn } from "@/lib/utils";
import PolicyItemCard from "./PolicyItemCard";
import {
  reducePolicyCartItem,
  type PolicyCart,
  type PolicyDisplayItem,
} from "./utils";
import {
  addOpenSelectionCartItem,
  getOpenSelectionGroupCartQuantity,
  getSelectedOpenSelectionGroup,
  type OpenSelectionGroup,
} from "./selectionConfigGroups";

type Props = {
  cart: PolicyCart;
  groups: OpenSelectionGroup[];
  hasApprovedOrder: boolean;
  items: PolicyDisplayItem[];
  setCart: Dispatch<SetStateAction<PolicyCart>>;
};

const OpenPolicyItemGroups = ({
  cart,
  groups,
  hasApprovedOrder,
  items,
  setCart,
}: Props) => {
  const [activeKey, setActiveKey] = useState(groups[0]?.key ?? "");
  const activeGroup = useMemo(
    () => getSelectedOpenSelectionGroup(groups, activeKey),
    [groups, activeKey],
  );

  useEffect(() => {
    if (!groups.length) return;
    if (!groups.some((group) => group.key === activeKey)) {
      setActiveKey(groups[0].key);
    }
  }, [activeKey, groups]);

  if (!groups.length) {
    return (
      <EmptyTableInstance
        description="No items match this catalog policy selection config."
        title="No configured items found"
      />
    );
  }

  const selectedCount = getOpenSelectionGroupCartQuantity(cart, activeGroup);
  const hasReachedLimit =
    activeGroup.max !== null && selectedCount >= activeGroup.max;
  const isUnlimitedGroup = activeGroup.max === null;

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
        {groups.map((group) => {
          const groupCount = getOpenSelectionGroupCartQuantity(cart, group);
          const isActive = group.key === activeGroup.key;

          return (
            <button
              key={group.key}
              type="button"
              className={cn(
                "min-w-max rounded-lg px-4 py-2 text-left text-sm font-semibold text-gray-600 transition",
                isActive && "bg-white text-gray-900 shadow-sm",
              )}
              onClick={() => setActiveKey(group.key)}
            >
              {group.name}
              <span className="ml-2 text-xs font-medium text-gray-400">
                {group.max === null
                  ? `${groupCount} selected`
                  : `${groupCount}/${group.max}`}
              </span>
            </button>
          );
        })}
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {activeGroup.name}
            </h3>
            <p className="text-sm text-gray-500">
              {isUnlimitedGroup
                ? "Choose as many items as needed from this category."
                : `Select ${activeGroup.min}-${activeGroup.max} item${activeGroup.max === 1 ? "" : "s"} from this category.`}
            </p>
          </div>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
            {isUnlimitedGroup
              ? `${selectedCount} selected`
              : `${selectedCount}/${activeGroup.max} selected`}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {activeGroup.items.map((item) => (
            <PolicyItemCard
              key={item.id}
              item={item}
              selectedQuantity={cart[item.id] ?? 0}
              addDisabled={hasReachedLimit}
              hideActions={hasApprovedOrder}
              hideQuantity
              onAdd={() =>
                setCart((currentCart) =>
                  addOpenSelectionCartItem(currentCart, item, items),
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
      </section>
    </div>
  );
};

export default OpenPolicyItemGroups;
