"use client";

import DrawerRight from "@/components/DrawerRight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPolicyCartItems,
  reducePolicyCartItem,
  syncRequiredPolicyCart,
} from "./CatalogPolicyDetail/utils";
import {
  addOpenSelectionCartItem,
  canAddOpenSelectionCartItem,
} from "./CatalogPolicyDetail/selectionConfigGroups";
import { useCatalogPolicyCart } from "./CatalogPolicyCartContext";
import { useCatalogPolicyOrderRequest } from "./useCatalogPolicyOrderRequest";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CatalogPolicyCartDrawer = ({ isOpen, onClose }: Props) => {
  const { cart, setCart, items, totalItems } = useCatalogPolicyCart();
  const cartItems = getPolicyCartItems(cart, items);
  const {
    approvedOrderMessage,
    canPlaceOrder,
    hasApprovedOrder,
    hasPendingOrder,
    isCheckingPendingOrder,
    isPlacingOrder,
    pendingOrderMessage,
    placeOrderRequest,
  } = useCatalogPolicyOrderRequest();

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      enableOverlay
      drawerTitle="Cart Overview"
      drawerDescription=""
      hideDefaultFooterBtn
      className="pt-0"
      data-testid="catalogpolicycartdrawer-drawerright"
    >
      <div className="sticky -top-6 z-10 -mx-6 -mt-6 bg-white px-6 pb-5 pt-6">
        <span className="rounded-full bg-primary-50 px-2 py-1 text-sm font-semibold text-primary-700">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
        <div className="mt-6 h-px w-full bg-gray-200" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full justify-center"
          disabled={totalItems === 0}
          onClick={() => setCart(syncRequiredPolicyCart({}, items))}
          data-testid="catalogpolicycartdrawer-button"
        >
          Clear all
        </Button>
      </div>

      <div className="space-y-4 pb-24 pt-5">
        {cartItems.map(({ item, quantity }) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex gap-3">
              <div className="grid size-16 shrink-0 place-content-center rounded-lg bg-gray-50">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-14 max-w-14 object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                  {[item.name, item.specs].filter(Boolean).join(" ")}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.category ? (
                    <Badge variant="blue">{item.category}</Badge>
                  ) : null}
                  {item.kitName ? (
                    <Badge variant="blue">{item.kitName}</Badge>
                  ) : null}
                  {item.required ? (
                    <Badge variant="secondary">Required</Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              {item.required ? (
                <span className="text-sm font-semibold text-gray-900">
                  Quantity: {quantity}
                </span>
              ) : (
                <>
                  <span className="text-xs text-gray-500">
                    {item.selectionGroupKey ? "Limit" : "Available"}:{" "}
                    {item.quantity}
                  </span>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-base"
                      onClick={() =>
                        setCart((currentCart) =>
                          reducePolicyCartItem(currentCart, item.id),
                        )
                      }
                      data-testid="catalogpolicycartdrawer-button-2"
                    >
                      -
                    </Button>
                    <span className="min-w-5 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-base disabled:pointer-events-auto disabled:cursor-not-allowed"
                      disabled={!canAddOpenSelectionCartItem(cart, item, items)}
                      onClick={() =>
                        setCart((currentCart) =>
                          addOpenSelectionCartItem(currentCart, item, items),
                        )
                      }
                      data-testid="catalogpolicycartdrawer-button-3"
                    >
                      +
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {cartItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm font-medium text-gray-900">
              No items in cart
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add policy items to see them here.
            </p>
          </div>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[210] border-t border-gray-200 bg-white px-6 py-4">
        {hasApprovedOrder || hasPendingOrder ? (
          <p className="mb-3 rounded-lg bg-warning-50 px-3 py-2 text-sm font-medium text-warning-700">
            {hasApprovedOrder ? approvedOrderMessage : pendingOrderMessage}
          </p>
        ) : null}
        {!hasApprovedOrder ? (
          <Button
            type="button"
            className="w-full text-sm"
            disabled={!canPlaceOrder}
            onClick={() => placeOrderRequest(onClose)}
            data-testid="catalogpolicycartdrawer-button-4"
          >
            {isPlacingOrder
              ? "Placing request..."
              : isCheckingPendingOrder
                ? "Checking pending order..."
                : "Place order request"}
          </Button>
        ) : null}
      </div>
    </DrawerRight>
  );
};

export default CatalogPolicyCartDrawer;
