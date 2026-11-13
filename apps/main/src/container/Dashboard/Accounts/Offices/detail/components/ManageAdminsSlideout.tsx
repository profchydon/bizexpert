import { useEffect, useState } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { isNestedRadixOverlay } from "@/utils/isNestedRadixOverlay";
import type { Office, OfficeAdminRef } from "../../../types";
import { useOfficeAdminOptions } from "../../hooks/useOfficeAdminOptions";
import { OfficeAdminPicker } from "../../wizard/OfficeAdminPicker";
import { AdminUserRow } from "./AdminUserRow";
import { officeModalFieldHintClass } from "./officeModalFieldClasses";

interface Props {
  office: Office;
  admins: OfficeAdminRef[];
  actingUserId?: string;
  isOpen: boolean;
  isInviting?: boolean;
  onClose: () => void;
  onAddAdmins: (admins: { id: string; name: string }[]) => void;
  onRequestRevoke: (admin: OfficeAdminRef) => void;
}

export function ManageAdminsSlideout({
  office,
  admins,
  actingUserId,
  isOpen,
  isInviting = false,
  onClose,
  onAddAdmins,
  onRequestRevoke,
}: Props) {
  const workspaceCompanyId = useWorkspaceCompanyId();
  const directory = useOfficeAdminOptions(!isOpen, office.region, {
    companyId: workspaceCompanyId,
  });
  const [picker, setPicker] = useState<string[]>([]);
  const [pickerPortal, setPickerPortal] = useState<HTMLElement | null>(null);
  const currentIds = new Set(admins.map((admin) => admin.id).filter(Boolean));
  const options = directory.options.filter(
    (option) => !currentIds.has(option.value),
  );
  const canRevoke = admins.length > 1;

  useEffect(() => {
    if (isOpen) setPicker([]);
  }, [isOpen]);

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      shouldCloseOnInteractOutside={(element) => !isNestedRadixOverlay(element)}
      ariaLabel="Manage admins"
    >
      <SlideoutMenu.Header onClose={onClose} className="pb-5">
        <h2 className="text-lg font-semibold text-gray-900">Manage admins</h2>
        <p className="text-sm text-gray-500">
          Add or remove who can manage {office.name}. Admins can manage its
          people, equipment, and areas.
        </p>
      </SlideoutMenu.Header>
      <div className="h-px w-full bg-gray-200" />
      <SlideoutMenu.Content className="gap-5">
        <div ref={setPickerPortal} className="flex flex-col gap-1.5">
          <OfficeAdminPicker
            label="Add an admin"
            modal={false}
            portalContainer={pickerPortal}
            value={picker}
            onChange={(next) => {
              const added = next
                .filter((id) => !currentIds.has(id))
                .map((id) => ({
                  id,
                  name:
                    directory.options.find((option) => option.value === id)
                      ?.label || "Employee",
                }));
              if (added.length) onAddAdmins(added);
              setPicker([]);
            }}
            options={options}
            onQueryChange={directory.setQuery}
            hasMore={directory.hasMore}
            onLoadMore={directory.loadMore}
            isLoadingMore={directory.isFetching || isInviting}
          />
          <p className={officeModalFieldHintClass}>
            {directory.requiresCountry
              ? "Office region is required to list admins."
              : `Pick a teammate in ${office.region}. They become an admin once they accept.`}
          </p>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            {admins.length} {admins.length === 1 ? "admin" : "admins"}
          </span>
          <ul className="mt-1 flex flex-col divide-y divide-gray-200">
            {admins.map((admin) => (
              <AdminUserRow
                key={admin.id ?? admin.name}
                admin={admin}
                canRevoke={canRevoke && admin.id !== actingUserId}
                onRevoke={() => onRequestRevoke(admin)}
              />
            ))}
          </ul>
          {!canRevoke && (
            <p className="mt-2 text-xs text-gray-500">
              An office must keep at least one admin. Add another before
              removing this one.
            </p>
          )}
        </div>
      </SlideoutMenu.Content>
      <SlideoutMenu.Footer className="flex items-center justify-end">
        <Button
          variant="outline"
          size="md"
          onClick={onClose}
          data-testid="manageadminsslideout-button"
        >
          Done
        </Button>
      </SlideoutMenu.Footer>
    </SlideoutMenu>
  );
}
