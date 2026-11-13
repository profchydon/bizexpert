import React from "react";
import DrawerRight from "@/components/DrawerRight";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { ICart } from "@/types/cart";
import useCart from "@/hooks/useCart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddItemsEmptyInstance from "@/components/Drawers/AddItems/AddItemsEmptyInstance";
import { IEquipment } from "@/types/equipments";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: (ICart | IEquipment)[];
  selectedValue?: string;
  handleSelection?: (value: string | undefined) => void;
  name?: string;
}

const AddItems: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  data,
  selectedValue,
  handleSelection,
  name,
}) => {
  const { carts: cartItemsData } = useCart();

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      isSaveButtonDisabled={!selectedValue}
      cancelText="Cancel"
      saveText="Add"
      drawerDescription={`Choose items for ${name || ""}`}
      drawerTitle="Add Items"
      data-testid="additems-drawerright"
    >
      <div className="flex flex-col">
        {data?.length < 1 && <AddItemsEmptyInstance />}

        {data?.length > 0 && (
          <ToggleGroup
            type="single"
            value={selectedValue}
            onValueChange={(value) => handleSelection?.(value)}
            className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3"
          >
            {data.map((item, index) => {
              const isCartItem = (item as ICart)?.specification !== undefined;

              const id = isCartItem
                ? (item as ICart).specification?.id
                : (item as IEquipment).id;

              const imageUrl = isCartItem
                ? (item as ICart).images?.[0]
                : (item as IEquipment).image_url;

              const title = isCartItem
                ? (item as ICart).asset?.name
                : (item as IEquipment).title;

              const propertiesText = isCartItem
                ? (item as ICart).specification?.properties
                    ?.map((p) => p.value)
                    .join(" ")
                : "";

              const cartQty = isCartItem
                ? cartItemsData.find(
                    (i) =>
                      i.specification?.id === (item as ICart).specification?.id,
                  )?.quantity || 0
                : 0;

              const selected = selectedValue === id;

              return (
                <ToggleGroupItem
                  key={index}
                  variant="outline"
                  value={id ?? ""}
                  className="w-full h-auto px-0 py-0 border-0"
                >
                  <Card
                    className={cn(
                      "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                      selected &&
                        "border-2 border-primary-600 bg-primary-50 text-primary-700",
                    )}
                  >
                    <CardContent className="p-4 flex flex-row items-start justify-between">
                      <div className="flex flex-row items-start space-x-2">
                        <Avatar className="h-[4rem] w-[4rem]">
                          <AvatarImage
                            src={imageUrl || ""}
                            alt="product_img"
                            className="rounded-[8px]"
                          />
                          <AvatarFallback className="text-gray-600 bg-gray-100">
                            {title?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1 flex flex-col items-start">
                          <p className="text-sm font-normal text-left">
                            <span
                              className={cn(
                                "font-medium",
                                selected ? "text-primary-800" : "text-gray-700",
                              )}
                            >
                              {title} {propertiesText}
                            </span>
                          </p>
                          {cartQty > 0 && (
                            <p className="text-[12px] font-normal my-1">
                              (Qty in cart - {cartQty})
                            </p>
                          )}
                        </div>
                      </div>

                      <Image
                        src={
                          selected ? checkbox_primary_600 : checkbox_gray_300
                        }
                        alt="check_icon"
                        width={24}
                        height={24}
                      />
                    </CardContent>
                  </Card>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        )}
      </div>
    </DrawerRight>
  );
};

export default AddItems;
