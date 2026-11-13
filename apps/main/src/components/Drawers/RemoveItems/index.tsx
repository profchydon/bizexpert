import React from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import RemoveItemsEmptyInstance from "./RemoveItemsEmptyInstance";
import { ICart } from "@/types/cart";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data?: any[];
  selectedValue?: string[];
  handleSelection?: (value: string[]) => void;
  handleRemoveFulfilmentDate?: () => void;
}

const RemoveItems: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  selectedValue,
  handleSelection,
  handleRemoveFulfilmentDate,
}) => {
  if (!isOpen) return null; // Don't remove this condition

  const searchParams = useSearchParams();
  const getEmployee_id = searchParams.get("employee_id");

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const getEmployees = employees?.find((item) => item.id === getEmployee_id);
  const employeeItems = getEmployees?.items as ICart[];
  const fulfilledDate = getEmployees?.fulfilment_date;

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      isSaveButtonDisabled={(selectedValue?.length ?? 0) < 1}
      cancelText="Cancel"
      saveText="Remove"
      drawerDescription={`Items added for ${getEmployees?.first_name || ""} ${getEmployees?.last_name || ""}`}
      drawerTitle="Remove Item"
      data-testid="removeitems-drawerright"
    >
      <div className="flex flex-col">
        {employeeItems?.length < 1 && <RemoveItemsEmptyInstance />}
        {employeeItems?.length > 0 && (
          <ToggleGroup
            type="multiple"
            defaultValue={selectedValue}
            value={selectedValue}
            className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3"
            onValueChange={(value: string[]) => handleSelection?.(value)}
          >
            {employeeItems?.map((item, index) => {
              const { asset, images, specification, quantity } = item;
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
                        `${selectedValue?.some((item: string) => item === specification?.id) && "border-primary-600 bg-primary-50 text-primary-700"}`,
                      )}
                    >
                      <CardContent className="p-4 flex flex-row items-start justify-between">
                        <div className="flex flex-row items-start space-x-2">
                          <Avatar className="h-[4rem] w-[4rem] z-0">
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
                                    "text-gray-700 font-medium line-clamp-2",
                                    `${selectedValue?.some((item: string) => item === specification?.id) && "text-primary-800"}`,
                                  )}
                                >
                                  {asset?.name} {getProps}
                                </span>
                              </p>
                            </div>

                            <div className="flex flex-row py-2">
                              <Button
                                className=" bg-[#ffffff] cursor-not-allowed rounded-lg border border-solid border-indigo-600 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-center w-5 h-7 font-medium text-sm text-black"
                                data-testid="removeitems-button"
                              >
                                -
                              </Button>
                              <input
                                type="text"
                                className="w-9 px-3 items-center border-0"
                                disabled
                                value={quantity}
                              />
                              <Button
                                className=" bg-[#ffffff] cursor-not-allowed rounded-lg border border-solid border-indigo-600 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-center w-5 h-7 font-medium text-sm text-black"
                                data-testid="removeitems-button-2"
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

        {fulfilledDate && (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm font-normal">Fulfillment start date</p>
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm font-normal">{fulfilledDate}</p>
              <p
                className="text-sm font-normal text-error-500 cursor-pointer"
                onClick={handleRemoveFulfilmentDate}
              >
                Remove
              </p>
            </div>
          </div>
        )}
      </div>
    </DrawerRight>
  );
};

export default RemoveItems;
