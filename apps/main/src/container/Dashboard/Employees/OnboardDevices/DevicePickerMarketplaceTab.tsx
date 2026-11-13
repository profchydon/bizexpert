import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetAssetsQuery } from "@/api/baseQueries/assetsApi/getAssets";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import SearchWithIcon from "@/components/SearchWithIcon";
import Pagination from "@/components/Custom/Pagination";
import { cn } from "@/lib/utils";
import type { IAsset } from "@/types/assets";
import MarketplaceDeviceRow from "./MarketplaceDeviceRow";
import { assetToEquipItem } from "./assetToEquipItem";
import type { EquipDeviceItem } from "./equipTypes";

interface Props {
  countryId?: string;
  addedAssetIds: Set<string>;
  onAdd: (item: EquipDeviceItem) => void;
}

const StatePanel: React.FC<{ text: string }> = ({ text }) => (
  <p className="px-6 py-14 text-center text-sm text-gray-500">{text}</p>
);

const DevicePickerMarketplaceTab: React.FC<Props> = ({
  countryId,
  addedAssetIds,
  onAdd,
}) => {
  const companyId = useWorkspaceCompanyId();
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 400);
  const [typeId, setTypeId] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchValue, typeId]);

  const { data: typesRes } = useGetAssetTypesQuery();
  const types = typesRes?.data ?? [];

  const { data, isFetching, isError } = useGetAssetsQuery(
    {
      companyId: companyId!,
      country_id: countryId,
      page,
      search: searchValue || undefined,
      type: typeId || undefined,
    },
    { skip: !companyId || !countryId },
  );

  const assets = data?.data?.data ?? [];
  const currentPage = data?.data?.current_page ?? 1;
  const lastPage = data?.data?.last_page ?? 1;

  if (!countryId) {
    return (
      <StatePanel text="We couldn't determine this employee's country, so the marketplace can't be loaded." />
    );
  }

  const filters = [{ id: "", name: "All" }, ...types];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-6 py-4">
        <SearchWithIcon
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search devices"
        />
      </div>

      <div className="overflow-x-auto border-y border-gray-100 px-6 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-1">
          {filters.map((filter) => {
            const active = typeId === filter.id;
            return (
              <button
                key={filter.id || "all"}
                type="button"
                onClick={() => setTypeId(filter.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition",
                  active
                    ? "bg-primary-50 font-semibold text-primary-700"
                    : "font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                )}
                data-testid="devicepickermarketplacetab-filter"
              >
                {filter.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isFetching ? (
          <StatePanel text="Loading devices…" />
        ) : isError ? (
          <StatePanel text="Something went wrong while loading devices." />
        ) : assets.length === 0 ? (
          <StatePanel text="No devices found for this country." />
        ) : (
          assets.map((asset: IAsset) => (
            <MarketplaceDeviceRow
              key={asset.id}
              asset={asset}
              added={addedAssetIds.has(asset.id)}
              onAdd={(next) => onAdd(assetToEquipItem(next))}
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

export default DevicePickerMarketplaceTab;
