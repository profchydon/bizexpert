"use client";

import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import EditEmployeeForm from "./EditEmployeeForm";
import { EDIT_PROFILE_SLIDEOUT_RESIZE } from "./employeeDetailSlideoutResize";
import { useEditEmployeeProfile } from "./useEditEmployeeProfile";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
};

const EditProfileSlideout = ({ isOpen, onClose, employeeId }: Props) => {
  const {
    form,
    save,
    isSaving,
    isLoading,
    canSave,
    canEditAddress,
    managerLabel,
    departmentItems,
    levelItems,
    countryItems,
  } = useEditEmployeeProfile(employeeId, onClose);

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel="Edit profile"
      dialogClassName="overflow-hidden"
      resizeOptions={EDIT_PROFILE_SLIDEOUT_RESIZE}
    >
      <div className="flex w-full shrink-0 items-start justify-between px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-primary">Edit profile</h2>
          <p className="mt-0.5 text-sm text-tertiary">
            Update this employee&apos;s details.
          </p>
        </div>
        <CloseButton size="sm" onPress={onClose} />
      </div>

      <div className="h-px w-full shrink-0 bg-border-secondary" />

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        {!isLoading ? (
          <EditEmployeeForm
            form={form}
            employeeId={employeeId}
            canEditAddress={canEditAddress}
            managerLabel={managerLabel}
            departmentItems={departmentItems}
            levelItems={levelItems}
            countryItems={countryItems}
          />
        ) : null}
      </div>

      <div className="flex w-full shrink-0 items-center justify-end gap-3 border-t border-secondary px-6 py-4">
        <Button
          size="md"
          color="secondary"
          onClick={onClose}
          data-testid="editprofileslideout-button"
        >
          Cancel
        </Button>
        <Button
          size="md"
          isDisabled={!canSave || isLoading}
          isLoading={isSaving}
          onClick={() => void save()}
          data-testid="editprofileslideout-button-2"
        >
          Save changes
        </Button>
      </div>
    </SlideoutMenu>
  );
};

export default EditProfileSlideout;
