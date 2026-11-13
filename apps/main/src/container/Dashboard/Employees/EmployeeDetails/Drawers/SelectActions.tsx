import React, { useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { safe_box, cart_box, transfer_box } from "@/assets/icons";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { ActionType } from "@/types/offboarding";

const cardData = [
  {
    type: "Store",
    buttonIcon: safe_box,
    buttonAlt: "safe_icon",
    title: "Store Item(s)",
    description: "We can store off-boarded devices for up to 12 months",
    checkboxIcon: checkbox_gray_300,
    checkboxIcon1: checkbox_primary_600,
    checkboxAlt: "check_primary_icon",
  },
  {
    type: "Transfer",
    buttonIcon: transfer_box,
    buttonAlt: "coin_swap_icon",
    title: "Transfer Item(s)",
    description: "Reassign equipment from one employee to another employee",
    checkboxIcon: checkbox_gray_300,
    checkboxIcon1: checkbox_primary_600,
    checkboxAlt: "check_primary_icon",
  },
  // {
  //   type: "Sell",
  //   buttonIcon: cart_box,
  //   buttonAlt: "shopping_trolly_icon",
  //   title: "Sell Item(s)",
  //   description: "Don't need your device anymore? We can help you sell them",
  //   checkboxIcon: checkbox_gray_300,
  //   checkboxIcon1: checkbox_primary_600,
  //   checkboxAlt: "check_primary_icon",
  // },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleNext: () => void;
  handleSetActionType: (value: ActionType) => void;
  actionType: ActionType;
}

const SelectActions: React.FC<Props> = ({
  isOpen,
  onClose,
  handleNext,
  handleSetActionType,
  actionType,
}) => {
  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        hideDefaultFooterBtn
        drawerTitle="What do you want to do"
        drawerDescription="Choose what you want to do after offboarding the employee"
        data-testid="selectactions-drawerright"
      >
        <div className="flex flex-col w-full gap-y-4 ">
          {cardData.map((data) => (
            <Card
              key={data.type}
              className={cn(
                "bg-white w-full text-gray-700 cursor-pointer",
                actionType == data.type &&
                  "border-primary-600 bg-primary-50 border-2 text-primary-700",
              )}
              onClick={() => handleSetActionType(data.type as unknown as any)}
            >
              <CardContent className="p-4 flex flex-row items-start space-x-2 justify-between">
                <Image
                  className="text-primary-600"
                  src={data.buttonIcon}
                  alt="data.buttonAlt"
                />
                <div className="space-y-1 flex flex-col items-start">
                  <p className="text-sm font-normal leading-none">
                    <span className="text-sm font-medium">{data.title}</span>
                  </p>
                  <p className="text-sm font-normal">{data.description}</p>
                </div>
                {actionType === data.type ? (
                  <Image
                    src={checkbox_primary_600}
                    alt="check_primary_icon"
                    // width={24}
                    // height={24}
                  />
                ) : (
                  <Image
                    src={checkbox_gray_300}
                    alt="check_primary_icon"
                    // width={24}
                    // height={24}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <DrawerFooter
          submitButtonType="button"
          saveText="Continue"
          onSubmit={handleNext}
          onClose={onClose}
          disableSubmitButton={!actionType}
        />
      </DrawerRight>
    </>
  );
};

export default SelectActions;
