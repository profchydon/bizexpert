"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  calendar_rounded_success_100,
  payment_error_icon,
} from "@/assets/icons";
import { DatePicker } from "@/components/ui/date-picker";
import { useEffect } from "react";
import CustomModal from "@/components/CustomModal";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  fulfilmentDate?: Date | string;
  setFulfillmentDate?: (value: Date | string) => void;
  onConfirm: () => void;
}

const AddFulfilmentDateToAllModal: React.FC<Props> = ({
  isOpen,
  onClose,
  fulfilmentDate,
  setFulfillmentDate,
  onConfirm,
}) => {
  useEffect(() => {
    if (fulfilmentDate) {
      return setFulfillmentDate?.(fulfilmentDate);
    }
    return setFulfillmentDate?.("");
  }, [fulfilmentDate]);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <>
        <div className="mx-auto">
          <Image
            src={calendar_rounded_success_100}
            alt="calendar_rounded_success_100"
          />
        </div>
        <div className="flex flex-col gap-y-2 mt-4">
          <p className="text-center text-lg font-semibold text-gray-900">
            Add fulfillment start date
          </p>
          <p className="text-center text-sm font-normal text-gray-600">
            Select a fulfillment start date for all the equipment in this order
          </p>

          <div className="mt-4 flex flex-col gap-2">
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
            {/* <DatePicker
              className="w-full h-[44px]"
              date={fulfilmentDate as Date}
              placeHolder="Select date"
              setDate={(value: Date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); 

                // Only update date if it is today or in the future
                if (value && value >= today && value !== fulfilmentDate) {
                  setFulfillmentDate?.(value);
                }
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today's date
                return date < today; // Disable past dates
              }}
            /> */}
          </div>
        </div>
        <div className="flex flex-row gap-3 items-center mt-8">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            data-testid="addfulfilmentdatetoall-button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="w-full"
            onClick={onConfirm}
            data-testid="addfulfilmentdatetoall-button-2"
          >
            Confirm
          </Button>
        </div>
      </>
    </CustomModal>
  );
};

export default AddFulfilmentDateToAllModal;
