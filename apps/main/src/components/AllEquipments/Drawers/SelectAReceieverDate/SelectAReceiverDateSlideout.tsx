"use client";

import { useCallback, useState } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { DatePicker } from "@/components/ui/date-picker";
import { isNestedRadixOverlay } from "@/utils/isNestedRadixOverlay";
import { SELECT_RECEIVER_DATE_SLIDEOUT_RESIZE } from "./selectReceiverDateSlideoutResize";
import {
  getCollectionDateSubmitDisabledReason,
  isValidCollectionStartDate,
} from "./selectReceiverDateValidation";

type Props = {
  isOpen: boolean;
  isEditable?: boolean;
  selectDate?: Date | string;
  submitDisabled: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  onDateChange: (value: Date) => void;
};

export function SelectAReceiverDateSlideout({
  isOpen,
  isEditable,
  selectDate,
  submitDisabled,
  onClose,
  onCancel,
  onSubmit,
  onDateChange,
}: Props) {
  const [datePickerPortal, setDatePickerPortal] = useState<HTMLElement | null>(
    null,
  );
  const setDateFieldRef = useCallback((node: HTMLDivElement | null) => {
    setDatePickerPortal(node);
  }, []);

  const title = isEditable ? "Edit" : "Select date";
  const description = isEditable
    ? "Please edit action details"
    : "Please select collection for the device(s)";

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      shouldCloseOnInteractOutside={(element) => !isNestedRadixOverlay(element)}
      ariaLabel={title}
      dialogClassName="overflow-hidden"
      resizeOptions={SELECT_RECEIVER_DATE_SLIDEOUT_RESIZE}
      data-testid="selectareceieverdate-drawerright"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex w-full shrink-0 items-start justify-between px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-primary">{title}</h2>
            <p className="mt-0.5 text-sm text-tertiary">{description}</p>
          </div>
          <CloseButton size="sm" onClick={onClose} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          <div ref={setDateFieldRef} className="flex flex-col gap-2">
            <p className="text-sm font-medium text-secondary">
              Collection start date
            </p>
            <DatePicker
              className="h-11 w-full"
              date={
                isValidCollectionStartDate(selectDate)
                  ? (selectDate as Date)
                  : undefined
              }
              placeHolder="Select date"
              disablePastDates
              setDate={onDateChange}
              popoverModal={false}
              popoverContainer={datePickerPortal}
              popoverContentClassName="z-[100010]"
            />
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center justify-end gap-3 border-t border-secondary px-6 py-4">
          <Button
            size="md"
            color="secondary"
            onClick={onCancel}
            data-testid="selectareceiverdateslideout-button"
          >
            Cancel
          </Button>
          <DisabledWithTooltip
            isDisabled={submitDisabled}
            reason={getCollectionDateSubmitDisabledReason(selectDate)}
          >
            <Button
              size="md"
              isDisabled={submitDisabled}
              onPress={onSubmit}
              data-testid="selectareceiverdateslideout-button-2"
            >
              Submit
            </Button>
          </DisabledWithTooltip>
        </div>
      </div>
    </SlideoutMenu>
  );
}
