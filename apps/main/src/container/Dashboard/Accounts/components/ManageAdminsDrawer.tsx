"use client";

import DrawerRight from "@/components/DrawerRight";
import { Button } from "@/components/ui/button";
import type { EntityAdminRow } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityPersonLabel";
import { useOfficeAdminOptions } from "../Offices/hooks/useOfficeAdminOptions";
import { OfficeAdminPicker } from "../Offices/wizard/OfficeAdminPicker";
import { EntityAdminRow as EntityAdminRowItem } from "./EntityAdminRow";
import { RevokeEntityAdminDialog } from "./RevokeEntityAdminDialog";
import { useManageEntityAdmins } from "../hooks/useManageEntityAdmins";
import { withDirectoryAdminState } from "../utils/pendingAdminOptions";
import { accountsDetailActionButtonClass } from "./accountsDetailHeaderClasses";

interface Props {
  entityId: string;
  entityName: string;
  admins: EntityAdminRow[];
  isPrimary: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageAdminsDrawer({
  entityId,
  entityName,
  admins,
  isPrimary,
  isOpen,
  onClose,
}: Props) {
  const manager = useManageEntityAdmins(
    entityId,
    entityName,
    admins,
    isPrimary,
    isOpen,
  );
  const directory = useOfficeAdminOptions(!isOpen, undefined, {
    filterByCountry: false,
  });
  const acceptedAdmins = manager.rows.filter((admin) => !admin.pending).length;
  const currentIds = new Set(manager.rows.map((admin) => admin.id));
  const options = withDirectoryAdminState(directory.options, manager.rows);

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        drawerTitle="Manage admins"
        drawerDescription={
          <p className="text-sm text-gray-600">
            Add or remove who can manage {entityName}. Admins can manage its
            offices, orders, and billing.
          </p>
        }
        enableOverlay
        width="480"
        hideDefaultFooterBtn
        customFooter={
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className={accountsDetailActionButtonClass}
              onClick={onClose}
              data-testid="manageadminsdrawer-button"
            >
              Done
            </Button>
          </div>
        }
        data-testid="manageadminsdrawer-drawerright"
      >
        <div className="flex flex-col gap-5 pb-2">
          <div className="flex flex-col gap-1.5">
            <OfficeAdminPicker
              id="entity-manage-admins"
              label="Add an admin"
              value={[]}
              options={options}
              onQueryChange={directory.setQuery}
              hasMore={directory.hasMore}
              onLoadMore={directory.loadMore}
              isLoadingMore={directory.isFetching}
              triggerClassName="text-sm"
              isLoading={manager.isInviting}
              pendingValue={manager.invitingId ?? undefined}
              hint="Pick a teammate or type an email address to invite them. They become an admin once they accept."
              onChange={(ids) => {
                const added = ids.filter((id) => id && !currentIds.has(id));
                if (!added.length) return;
                manager.addAdmins(
                  added.map((id) => ({
                    id,
                    name:
                      directory.options.find((option) => option.value === id)
                        ?.label || "Admin",
                    email: "",
                  })),
                );
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {manager.rows.length}{" "}
              {manager.rows.length === 1 ? "admin" : "admins"}
            </span>
            <ul className="mt-1 flex flex-col divide-y divide-gray-200">
              {manager.rows.map((admin) => (
                <EntityAdminRowItem
                  key={admin.invitationId ?? admin.id}
                  admin={admin}
                  pending={admin.pending}
                  canRevoke={admin.pending || acceptedAdmins > 1}
                  disabled={manager.isSaving}
                  onRevoke={() => manager.requestRevoke(admin)}
                />
              ))}
            </ul>
            {acceptedAdmins <= 1 && (
              <p className="mt-2 text-xs text-gray-500">
                An entity must keep at least one admin. Add another before
                removing this one.
              </p>
            )}
          </div>
        </div>
      </DrawerRight>
      <RevokeEntityAdminDialog
        name={manager.pendingRevoke?.name ?? null}
        entityName={entityName}
        pending={manager.pendingRevoke?.pending}
        isOpen={Boolean(manager.pendingRevoke)}
        isSaving={manager.isSaving}
        onClose={manager.cancelRevoke}
        onConfirm={manager.confirmRevoke}
      />
    </>
  );
}
