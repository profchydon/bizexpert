"use client";

import { RefreshCw03 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { AddEmployeesTabFooter } from "../addEmployeesTabFooter";

type Props = {
  onCancel: () => void;
  onContinue: () => void;
  onReupload: () => void;
  isSubmitting?: boolean;
  canContinue?: boolean;
};

export function ImportEmployeePreviewFooter({
  onCancel,
  onContinue,
  onReupload,
  isSubmitting,
  canContinue = true,
}: Props) {
  return (
    <AddEmployeesTabFooter justify="between">
      <Button
        color="link-gray"
        size="md"
        iconLeading={RefreshCw03}
        onClick={onReupload}
        data-testid="importemployeepreviewfooter-button"
      >
        Re-upload
      </Button>
      <div className="flex items-center gap-3">
        <Button
          color="secondary"
          size="md"
          onClick={onCancel}
          data-testid="importemployeepreviewfooter-button-2"
        >
          Cancel
        </Button>
        <Button
          size="md"
          isDisabled={!canContinue}
          isLoading={isSubmitting}
          onClick={onContinue}
          data-testid="importemployeepreviewfooter-button-3"
        >
          Continue
        </Button>
      </div>
    </AddEmployeesTabFooter>
  );
}
