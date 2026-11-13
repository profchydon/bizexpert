"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Location } from "@/types/bizexpert";
import { filterLocationsBySearch } from "../filterLocationsBySearch";
import { readLocationApiError } from "../locationApiError";
import { locationsQueryKeys } from "../locationsQueryKeys";
import {
  locationsTableCountBadgeClass,
  locationsTableShellClass,
  locationsTableTitleClass,
  locationsTableToolbarClass,
} from "../locationsPageClasses";
import { locationsTableColumns } from "./tableColumns";
import { LocationsTableActions } from "./tableActions";
import { CreateLocation } from "../CreateLocation";
import { DeleteLocationModal } from "../DeleteLocationModal";
import { LocationStaffModal } from "../LocationStaffModal";

type Props = {
  onCreate: () => void;
};

export function LocationsTable({ onCreate }: Props) {
  const { businessId, refreshBusiness } = useBizExpertBusiness();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [staffLocation, setStaffLocation] = useState<Location | null>(null);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: locationsQueryKeys.list(businessId ?? ""),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/locations`);
      return res.data as Location[];
    },
  });

  const setDefault = useMutation({
    mutationFn: async (locationId: string) => {
      await bizexpertApi.post(
        `/businesses/${businessId}/locations/${locationId}/set-default`,
      );
    },
    onSuccess: async () => {
      toast.success("Default store updated");
      await qc.invalidateQueries({
        queryKey: locationsQueryKeys.list(businessId ?? ""),
      });
      await refreshBusiness();
    },
    onError: (err) => toast.error(readLocationApiError(err, "Update failed")),
  });

  const removeLocation = useMutation({
    mutationFn: async (locationId: string) => {
      await bizexpertApi.delete(
        `/businesses/${businessId}/locations/${locationId}`,
      );
    },
    onSuccess: async (_data, locationId) => {
      toast.success("Store deleted");
      setDeleteLocation(null);
      setStaffLocation((current) =>
        current?.id === locationId ? null : current,
      );
      setEditLocation((current) =>
        current?.id === locationId ? null : current,
      );
      await qc.invalidateQueries({
        queryKey: locationsQueryKeys.list(businessId ?? ""),
      });
      await refreshBusiness();
    },
    onError: (err) => toast.error(readLocationApiError(err, "Delete failed")),
  });

  const rows = useMemo(
    () => filterLocationsBySearch(data ?? [], search),
    [data, search],
  );

  const columns = useMemo(
    () =>
      locationsTableColumns({
        renderActions: (item) => (
          <LocationsTableActions
            item={item}
            onEdit={() => setEditLocation(item)}
            onManageStaff={() => setStaffLocation(item)}
            onSetDefault={() => setDefault.mutate(item.id)}
            onDelete={() => setDeleteLocation(item)}
          />
        ),
      }),
    [setDefault],
  );

  return (
    <div className="space-y-4">
      <div className={locationsTableShellClass}>
        <div className={locationsTableToolbarClass}>
          <h3 className={locationsTableTitleClass}>
            Stores
            {!isLoading && rows.length > 0 && (
              <span className={locationsTableCountBadgeClass}>
                {rows.length}
              </span>
            )}
          </h3>
          <div className="flex flex-row gap-x-2">
            <SearchWithIcon
              className="w-[310px]"
              placeholder="Search by name or address"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <PageState isLoading={isLoading} isError={isError}>
          <DataTable
            data={rows}
            columns={columns}
            paginationClassName={referenceTablePaginationClass}
          >
            <EmptyTableInstance
              title="No stores yet"
              description="Add a regular store or warehouse to sell and track stock."
              buttonText="Add new store"
              onButtonClick={onCreate}
            />
          </DataTable>
        </PageState>
      </div>
      {staffLocation && businessId ? (
        <LocationStaffModal
          isOpen
          businessId={businessId}
          location={staffLocation}
          onClose={() => setStaffLocation(null)}
        />
      ) : null}
      <CreateLocation
        isOpen={Boolean(editLocation)}
        location={editLocation}
        onClose={() => setEditLocation(null)}
      />
      {deleteLocation ? (
        <DeleteLocationModal
          isOpen
          location={deleteLocation}
          isDeleting={removeLocation.isPending}
          onClose={() => setDeleteLocation(null)}
          onConfirm={() => removeLocation.mutate(deleteLocation.id)}
        />
      ) : null}
    </div>
  );
}
