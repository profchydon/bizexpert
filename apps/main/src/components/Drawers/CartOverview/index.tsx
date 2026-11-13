"use client";

import { ChevronUp, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import { product_1 } from "@/assets/images";
import formatAmount from "@/utils/formatAmount";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { cn } from "@/lib/utils";
import useCart from "@/hooks/useCart";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import OnboardStorageDuration from "../OnboardStorageDuration";
import {
  setBuyToStorageItems,
  setRefreshDeviceItems,
  updateSelectedEquipment,
} from "@/store/slices/equipEmployeeSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { ICart } from "@/types/cart";
import AddSetup from "@/components/DeviceRefresh/AddSetup";
import routes from "@/routes";
import StoragedurationWithCollectionDate from "@/components/DeviceRefresh/StoragedurationWithCollectionDate";
import { IAssetRefreshList } from "@/types/assetRefresh";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { IEmployees } from "@/types/employees";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CartOverview: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const params = useSearchParams();
  const router = useRouter();
  const { push, isPending: isConfirmSetupPending } = useTransitionRouter();
  const isDeviceRefreshInstance = Boolean(params.get("device-refresh"));
  const isDeviceRefreshSingleInstance = Boolean(params.get("single-instance"));
  const isExtra_items = Boolean(params.get("extra_items"));
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  const [isStorageOpen, setIsStorageOpen] = useState(false);

  const dispatch = useAppDispatch();

  const {
    carts,
    isAddToCartLoading,
    totalAmount,
    totalEquipment,
    decrementItem,
    incrementItem,
    removeItemFromCart,
    removeAllItemsFromCart,
  } = useCart();

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const currencySymbol = useWorkspaceCurrencySymbol();

  const [isAddSetupOpen, setIsAddSetupOpen] = useState(false);
  const [isStorageDurationOpen, setIsStorageDurationOpen] = useState(false);
  const [addSetupData, setAddSetupData] = useState<ICart[]>([]);
  const [addNote, setAddNote] = useState<string>();
  const [isConfirmSetupNavigating, setIsConfirmSetupNavigating] =
    useState(false);

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee.selectedEmployee,
  );

  const deviceRefreshSelectedEquipment = useAppSelector(
    (state) => state.persistedReducers.equipEmployee?.selectedEquipment,
  );

  const isNoCountry = employees?.some((employee) => !employee.country);

  const isNigeria = company?.country?.name?.toLowerCase() === "nigeria";

  const cartItems = carts;

  const getInsuranceTotalAmount = () => {
    let totalAmount = 0;

    cartItems.forEach((item) => {
      const lineTotal =
        Number(item.pricing?.amount || item.amount) * item.quantity;
      const percentageAmount = lineTotal * 0.05;
      totalAmount += percentageAmount;
    });
    return totalAmount;
  };
  const subTotal = getInsuranceTotalAmount() + totalAmount;

  useEffect(() => {
    if (carts?.length === 0) {
      onClose();
    }
  }, [carts?.length]);

  useEffect(() => {
    if (!isConfirmSetupNavigating || isConfirmSetupPending) {
      return;
    }

    setAddSetupData([]);
    setAddNote("");
    setIsAddSetupOpen(false);
    setIsConfirmSetupNavigating(false);
  }, [isConfirmSetupNavigating, isConfirmSetupPending]);

  const handleSendToEmployee = () => {
    onSave();
    onClose();
    setIsPopOverOpen(false);
    if (isNoCountry && !isExtra_items) {
      dispatch(setSelectedEmployees([]));
    }
  };

  const handleMoveToStorage = () => {
    onClose();
    dispatch(setBuyToStorageItems(cartItems));

    dispatch(
      setSelectedEmployees([
        {
          id: UNASSIGNED_ORDER_SUMMARY_KEY,
          items: cartItems,
        } as unknown as IEmployees,
      ]),
    );
    setIsPopOverOpen(false);
    router.push(routes.EQUIP_EMPLOYEE_ORDER_SUMMARY);
  };

  const handleRefreshDeviceBuyInstance = () => {
    const totalCartQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    );
    const totalEquipments = (
      deviceRefreshSelectedEquipment as IAssetRefreshList[]
    )?.length;

    if (totalCartQuantity > totalEquipments) {
      return displayErrorMessage(
        `You have selected ${totalCartQuantity} items, but only ${totalEquipments} equipment${totalEquipments > 1 ? "s are" : " is"} available.`,
      );
    }

    dispatch(setRefreshDeviceItems(cartItems as any[]));
    setIsAddSetupOpen(true);
    onClose();
  };

  const updateWithNote = (note: string) => {
    if (!note) return addSetupData;

    const addNoteToOnBoardingData = addSetupData?.map((items) => {
      return { ...items, note };
    });
    return addNoteToOnBoardingData;
  };

  const handleConfirmSetup = () => {
    const updateNote = updateWithNote(addNote as string) as any[];
    dispatch(setRefreshDeviceItems([...updateNote]));

    if (isDeviceRefreshSingleInstance) {
      setIsStorageDurationOpen(true);
      setAddSetupData([]);
      setAddNote("");
      setIsAddSetupOpen(false);
      return;
    }

    setIsConfirmSetupNavigating(true);
    push(
      `${routes?.ALL_EQUIPMENT_REFRESH_VIEW_ACTION}?device-refresh=true&flow-source=from_marketplace`,
    );
  };

  const handleNextActionToOrderSummary = () => {
    router.push(
      `${routes?.ALL_EQUIPMENT_REFRESH_ORDER_SUMMARY}?device-refresh=true&flow-source=from_marketplace`,
    );
  };

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        drawerDescription=""
        drawerTitle="Cart Overview"
        cancelText="Continue shopping"
        saveText={
          <>
            {isDeviceRefreshInstance ? (
              <Button
                className="h-10 w-full text-sm font-semibold"
                onClick={handleRefreshDeviceBuyInstance}
                data-testid="cartoverview-button"
              >
                Checkout
              </Button>
            ) : (
              <Popover
                open={isPopOverOpen}
                onOpenChange={(value) => setIsPopOverOpen(value)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 w-full bg-primary-50 text-base font-semibold text-primary-700"
                    data-testid="cartoverview-button-2"
                  >
                    Proceed
                    <ChevronUp />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="flex flex-col gap-y-2">
                    <Button
                      className="text-sm"
                      onClick={handleSendToEmployee}
                      data-testid="cartoverview-button-3"
                    >
                      Send to employee
                    </Button>
                    <Button
                      variant="ghost"
                      className="bg-primary-50 w-full space-x-2 text-primary-700 text-base font-semibold"
                      onClick={handleMoveToStorage}
                      data-testid="cartoverview-button-4"
                    >
                      Move to storage
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </>
        }
        data-testid="cartoverview-drawerright"
        className="px-0 pt-0"
      >
        <div className="border-b border-gray-200 px-6 pb-4 pt-5">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <span className="shrink-0 rounded-lg bg-[#F0F6FF] px-2 py-1 text-sm font-semibold text-gray-900">
              {totalEquipment ?? 0} item(s)
            </span>
            <span className="shrink-0 text-xl font-semibold text-gray-900">
              {currencySymbol} {formatAmount(String(totalAmount))}
            </span>
          </div>
        </div>

        {carts?.length > 0 && (
          <div className="px-6 py-5">
            <Button
              className="w-full"
              variant={"outline"}
              onClick={removeAllItemsFromCart}
              disabled={isAddToCartLoading}
              data-testid="cartoverview-button-5"
            >
              Clear Cart
            </Button>
          </div>
        )}

        <div className="flex flex-col">
          {cartItems.map((item) => {
            const specText = item.specification.properties
              .map((prop) => prop.value)
              .join(" ");
            return (
              <div
                key={item.pricing.id}
                className="border-b border-gray-200 px-6 py-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage
                      src={(item?.images?.[0] as string) || product_1}
                      alt="asset_image"
                    />
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="min-w-0">
                      <p
                        className="line-clamp-2 text-sm font-semibold text-gray-900"
                        title={item?.asset.name}
                      >
                        {item?.asset.name}
                      </p>
                      <p
                        className="line-clamp-2 text-sm text-gray-500"
                        title={specText}
                      >
                        {specText}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={cn(
                          "grid h-8 w-8 cursor-pointer place-content-center rounded-lg border border-gray-200 disabled:cursor-not-allowed",
                          isAddToCartLoading &&
                            "pointer-events-none opacity-70",
                        )}
                        onClick={() => {
                          if (item.pricing.id) {
                            decrementItem(item.pricing.id);
                          }
                        }}
                        disabled={
                          isDeviceRefreshInstance &&
                          isDeviceRefreshSingleInstance
                        }
                      >
                        <span className="text-gray-700">-</span>
                      </button>
                      <div className="text-base font-semibold text-gray-900">
                        {item.quantity}
                      </div>
                      <button
                        type="button"
                        className={cn(
                          "grid h-8 w-8 cursor-pointer place-content-center rounded-lg border border-gray-200 disabled:cursor-not-allowed",
                          isAddToCartLoading &&
                            "pointer-events-none opacity-70",
                        )}
                        onClick={() => incrementItem(item.pricing.id)}
                        disabled={
                          isDeviceRefreshInstance &&
                          isDeviceRefreshSingleInstance
                        }
                      >
                        <span className="text-gray-700">+</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      aria-label="Remove from cart"
                      className="text-gray-500 transition-colors hover:text-gray-700"
                      onClick={() => removeItemFromCart(item.pricing.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <span className="whitespace-nowrap text-sm text-gray-600">
                      {`${currencySymbol} ${formatAmount(item.amount)}`} (
                      {item.quantity})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          {isNigeria && (
            <>
              <div className="border-t border-gray-200">
                <div className="flex min-w-0 items-center justify-between gap-4 px-6 py-4">
                  <span className="text-sm font-medium">Insurance</span>
                  <span className="shrink-0 text-sm font-medium">
                    5% ({currencySymbol}
                    {formatAmount(getInsuranceTotalAmount().toString())})
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <div className="flex min-w-0 items-center justify-between gap-4 px-6 py-4">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="shrink-0 text-sm font-medium">
                    {currencySymbol}
                    {formatAmount(subTotal.toString())}
                  </span>
                </div>
              </div>
            </>
          )}

          {!isNigeria && (
            <div className="border-t border-gray-200">
              <div className="flex min-w-0 items-center justify-between gap-4 px-6 py-4">
                <span className="text-sm font-medium">Total</span>
                <span className="shrink-0 text-sm font-medium">
                  {currencySymbol}
                  {formatAmount(String(totalAmount ?? 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      </DrawerRight>

      <OnboardStorageDuration
        isOpen={isStorageOpen}
        onClose={() => setIsStorageOpen(false)}
      />

      <AddSetup
        isOpen={isAddSetupOpen}
        onClose={() => setIsAddSetupOpen(false)}
        onSave={handleConfirmSetup}
        isSaveLoading={isConfirmSetupNavigating}
        addSetupData={addSetupData}
        setAddSetupData={setAddSetupData}
        addNote={addNote}
        setAddNote={setAddNote}
      />

      <StoragedurationWithCollectionDate<IAssetRefreshList>
        isOpen={isStorageDurationOpen}
        onClose={() => setIsStorageDurationOpen(!isStorageDurationOpen)}
        title="Storage Duration"
        onNext={handleNextActionToOrderSummary}
        dataInstance={deviceRefreshSelectedEquipment as IAssetRefreshList[]}
        updateData={(data) => dispatch(updateSelectedEquipment(data))}
        hideNote
      />
    </>
  );
};

export default CartOverview;
