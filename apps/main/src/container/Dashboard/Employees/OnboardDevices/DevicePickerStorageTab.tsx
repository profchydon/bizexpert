import React, { useEffect, useState } from "react";
import { useGetInStorageEquipmentsByCountryQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageEquipmentsByCountry";
import Pagination from "@/components/Custom/Pagination";
import type { IEquipmentsInStorageByCountry } from "@/types/equipments";
import StorageDeviceRow from "./StorageDeviceRow";
import { storageItemToEquipItem } from "./storageItemToEquipItem";
import type { EquipDeviceItem } from "./equipTypes";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  countryId?: string;
  currency?: string;
  addedAssetIds: Set<string>;
  unavailableIds?: Set<string>;
  onAdd: (item: EquipDeviceItem) => void;
}

const StatePanel: React.FC<{ text: string }> = ({ text }) => (
  <p className="px-6 py-14 text-center text-sm text-gray-500">{text}</p>
);

const DevicePickerStorageTab: React.FC<Props> = ({
  countryId,
  currency,
  addedAssetIds,
  unavailableIds,
  onAdd,
}) => {
  const companyId = useWorkspaceCompanyId();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [countryId]);

  const { data, isFetching, isError } = useGetInStorageEquipmentsByCountryQuery(
    { companyId: companyId!, countryId: countryId!, params: { page } },
    { skip: !companyId || !countryId },
  );

  const devices = (data?.data?.data ?? []).filter(
    (device: IEquipmentsInStorageByCountry) => !unavailableIds?.has(device.id),
  );
  const currentPage = data?.data?.current_page ?? 1;
  const lastPage = data?.data?.last_page ?? 1;

  if (!countryId) {
    return (
      <StatePanel text="We couldn't determine this employee's country, so storage can't be loaded." />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isFetching ? (
          <StatePanel text="Loading storage inventory…" />
        ) : isError ? (
          <StatePanel text="Something went wrong while loading storage inventory." />
        ) : devices.length === 0 ? (
          <StatePanel text="No available devices in storage for this country." />
        ) : (
          devices.map((device: IEquipmentsInStorageByCountry) => (
            <StorageDeviceRow
              key={device.id}
              device={device}
              added={addedAssetIds.has(device.id)}
              onAdd={(next) => onAdd(storageItemToEquipItem(next, currency))}
            />
          ))
        )}
      </div>

      {lastPage > 1 && (
        <div className="border-t border-gray-100 px-6 py-3">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default DevicePickerStorageTab;
