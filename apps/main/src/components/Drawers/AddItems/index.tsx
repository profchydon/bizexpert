import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { ICart } from "@/types/cart";
import AddItemsEmptyInstance from "./AddItemsEmptyInstance";
import useCart from "@/hooks/useCart";
import { DatePicker } from "@/components/ui/date-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: ICart[];
  selectedValue?: string[];
  handleSelection?: (value: string[]) => void;
  incrementCartItem?: (
    e: React.MouseEvent<HTMLButtonElement>,
    itemId: string,
  ) => void;
  decrementCartItem?: (
    e: React.MouseEvent<HTMLButtonElement>,
    itemId: string,
  ) => void;
  fulfilmentDate?: Date | string;
  setFulfillmentDate?: (value: Date | string) => void;
}

const AddItems: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  data,
  selectedValue,
  handleSelection,
  incrementCartItem,
  decrementCartItem,
  fulfilmentDate,
  setFulfillmentDate,
}) => {
  // if (!isOpen) return <></>; // Don't remove this condition
  // I had to remove this condition cause it causes the page not to scroll.
  const searchParams = useSearchParams();
  const getEmployee_id = searchParams.get("employee_id");

  const { carts: cartItemsData } = useCart();

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const getEmployees = employees?.find((item) => item.id === getEmployee_id);

  useEffect(() => {
    const fulfilledDate = getEmployees?.fulfilment_date;
    if (fulfilledDate) {
      return setFulfillmentDate?.(fulfilledDate);
    }
    return setFulfillmentDate?.("");
  }, [getEmployees]);

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      isSaveButtonDisabled={(selectedValue?.length ?? 0) < 1 && !fulfilmentDate}
      cancelText="Cancel"
      saveText="Add"
      drawerDescription={`Choose items for ${getEmployees?.first_name || ""} ${getEmployees?.last_name || ""}`}
      drawerTitle="Add Items"
      data-testid="additems-drawerright"
    >
      <div className="flex flex-col">
        {data?.length < 1 && <AddItemsEmptyInstance />}
        {data?.length > 0 && (
          <ToggleGroup
            type="multiple"
            defaultValue={selectedValue}
            value={selectedValue}
            className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3"
            onValueChange={(value: string[]) => handleSelection?.(value)}
          >
            {data?.map((item, index) => {
              const { asset, specification, images, quantity } = item;
              const initialDataItem = cartItemsData.find(
                (item) => item?.specification?.id === specification?.id,
              );
              const getProps = specification.properties
                .map((prop) => prop.value)
                .join(" ");
              return (
                <ToggleGroupItem
                  key={index}
                  variant="outline"
                  value={String(specification?.id)}
                  className="w-full h-auto px-0 py-0 border-0"
                  asChild
                >
                  <div className="flex flex-col w-full">
                    <Card
                      className={cn(
                        "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                        `${selectedValue?.some((item: string) => item === specification?.id) && "border-2 border-primary-600 bg-primary-50 text-primary-700"}`,
                      )}
                    >
                      <CardContent className="p-4 flex flex-row items-start justify-between">
                        <div className="flex flex-row items-start space-x-2">
                          <Avatar className="h-[4rem] w-[4rem]">
                            <AvatarImage
                              src={images?.[0] || ""}
                              alt="product_img"
                              className="rounded-[8px]"
                            />
                            <AvatarFallback className="text-gray-600 bg-gray-100">{`${asset?.name?.[0]}`}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex flex-col items-start">
                            <div className="flex flex-col items-start">
                              <p className="text-sm font-normal text-left">
                                <span
                                  className={cn(
                                    "text-gray-700 font-medium",
                                    `${selectedValue?.some((item: string) => item === specification?.id) && "text-primary-800"}`,
                                  )}
                                >
                                  {asset?.name} {getProps}
                                </span>
                              </p>
                              <p className="text-[12px] font-normal my-1">{`(Qty in cart - ${initialDataItem?.quantity})`}</p>
                            </div>

                            <div className="flex items-center py-1">
                              <Button
                                onClick={(e) =>
                                  decrementCartItem?.(
                                    e,
                                    String(specification?.id),
                                  )
                                }
                                className=" bg-[#ffffff] rounded-lg border border-solid border-indigo-600 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-center w-5 h-7 font-medium text-sm text-black"
                                data-testid="additems-button"
                              >
                                -
                              </Button>
                              <div className="w-fit">
                                <span className="px-3 border-0 pointer-events-none">
                                  {Number(quantity)}
                                </span>
                              </div>
                              <Button
                                onClick={(e) =>
                                  incrementCartItem?.(
                                    e,
                                    String(specification?.id),
                                  )
                                }
                                className="bg-[#ffffff] rounded-lg border border-solid border-indigo-600 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-center w-5 h-7 font-medium text-sm text-black"
                                data-testid="additems-button-2"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>

                        {!selectedValue?.some(
                          (item: string) => item === specification?.id,
                        ) ? (
                          <Image
                            src={checkbox_gray_300}
                            alt="check_primary_icon"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <Image
                            src={checkbox_primary_600}
                            alt="check_primary_icon"
                            width={24}
                            height={24}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <p className="text-sm font-normal">Fulfillment start date</p>
          <DatePicker
            className="w-full h-[44px]"
            date={fulfilmentDate as Date}
            placeHolder="Select date"
            disablePastDates
            setDate={(value: Date) => {
              if (value !== fulfilmentDate) {
                setFulfillmentDate?.(value);
              }
            }}
          />
        </div>
      </div>
    </DrawerRight>
  );
};

export default AddItems;
