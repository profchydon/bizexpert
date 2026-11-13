import React from "react";
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
import { IEquipmentsInStorageByCountry } from "@/types/equipments";
import { Badge } from "@/components/ui/badge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: IEquipmentsInStorageByCountry[];
  selectedValue?: string[];
  handleSelection?: (value: string[]) => void;
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
  fulfilmentDate,
  setFulfillmentDate,
}) => {
  const searchParams = useSearchParams();
  const getEmployee_id = searchParams.get("employee_id");

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const getEmployees = employees?.find((item) => item.id === getEmployee_id);

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      isSaveButtonDisabled={(selectedValue?.length ?? 0) < 1}
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
            className="w-full gap-y-5 px-0 flex flex-col items-start justify-between mt-3"
            onValueChange={(value: string[]) => handleSelection?.(value)}
          >
            {data?.map((storageItem, index) => {
              return (
                <ToggleGroupItem
                  key={index}
                  variant="outline"
                  value={storageItem?.id!}
                  className="w-full h-auto px-0 py-0 border-0"
                >
                  <div className="flex flex-col w-full">
                    <Card
                      className={cn(
                        "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                        `${selectedValue?.some((item: string) => item === storageItem?.id) && "border-2 border-primary-600 bg-primary-50 text-primary-700"}`,
                      )}
                    >
                      <CardContent className="p-4 flex flex-row items-start justify-between">
                        <div className="flex flex-row items-start space-x-2">
                          <Avatar className="h-[3rem] w-[3rem]">
                            <AvatarImage
                              src={storageItem?.image_url || ""}
                              alt="product_img"
                              className="rounded-[8px]"
                            />
                            <AvatarFallback className="text-gray-600 bg-gray-100">{`${storageItem?.title?.[0]}`}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex flex-col items-start">
                            <div className="flex flex-col items-start">
                              <p className="text-sm font-normal text-left">
                                <span
                                  className={cn(
                                    "text-gray-700 font-medium",
                                    `${selectedValue?.some((item: string) => item === storageItem?.id) && "text-primary-800"}`,
                                  )}
                                >
                                  {storageItem?.title}
                                </span>
                              </p>
                            </div>
                            <span className="text-sm text-gray-600 font-normal">
                              {storageItem?.serial_number ?? (
                                <Badge variant="red">Not available</Badge>
                              )}
                            </span>
                          </div>
                        </div>

                        {!selectedValue?.some(
                          (item: string) => item === storageItem?.id,
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

        {data?.length > 0 && (
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
        )}
      </div>
    </DrawerRight>
  );
};

export default AddItems;
