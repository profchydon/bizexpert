import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { CircleCheck } from "lucide-react";
import AfterOffboardingInfo from "./SelectActions";
import { IEmployees } from "@/types/employees";
import { Separator } from "@/components/ui/separator";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleNext: () => void;
}

const OffboardingInfo: React.FC<Props> = ({ isOpen, onClose, handleNext }) => {
  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onCancel={onClose}
        onClose={onClose}
        drawerTitle="Off boarding an employee"
        drawerDescription="Information about off boarding an employee"
        hideDefaultFooterBtn
        data-testid="offboardinginfo-drawerright"
      >
        <div className="gap-y-6 mb-[75px]">
          <div className="flex flex-col gap-y-1 pb-2">
            <span className="font-medium text-base leading-6">
              Off boarding an employee: What it Means and What to Expect
            </span>
            <span className="text-sm font-normal">
              Here's a breakdown of what off boarding typically entails:
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-y-7 pt-4">
            <div className="flex flex-row gap-2">
              <CircleCheck className="w-10 text-primary-600" />
              <span className="text-base font-normal text-gray-600">
                The employee's access to company systems and resources will be
                revoked
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <CircleCheck className="w-10 text-primary-600" />
              <span className="text-base font-normal text-gray-600">
                The employee's status will be updated from "Active" to
                "Archived"
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <CircleCheck className="w-6 text-primary-600" />
              <span className="text-base font-normal text-gray-600">
                Access to dashboards will be revoked.
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <CircleCheck className="w-6 text-primary-600" />
              <span className="text-base font-normal text-gray-600">
                Any pending requests will be canceled.
              </span>
            </div>
          </div>
        </div>

        <DrawerFooter
          onClose={onClose}
          onSubmit={handleNext}
          saveText="Continue"
          submitButtonType="button"
        />
      </DrawerRight>
    </>
  );
};

export default OffboardingInfo;
