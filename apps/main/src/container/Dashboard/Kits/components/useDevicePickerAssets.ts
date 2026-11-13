"use client";

import { useGetKitAssetsQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKitAssets";

import { buildKitAssetsParams } from "../devicePickerQueryParams";
import { normalizeAssets } from "./DevicePickerDialog.utils";

export function useDevicePickerAssets({
  categoryId,
  companyId,
  kitId,
  open,
  page,
  search,
}: {
  categoryId: string | null;
  companyId?: string;
  kitId: string;
  open: boolean;
  page: number;
  search: string;
}) {
  const query = useGetKitAssetsQuery(
    {
      companyId: companyId ?? "",
      kitId,
      params: buildKitAssetsParams({ categoryId, page, search }),
    },
    { skip: !open || !companyId || !kitId },
  );

  return {
    devices: normalizeAssets(query.data?.data),
    isFetching: query.isFetching,
    paginationMeta: getPaginationMeta(query.data?.data),
  };
}

function getPaginationMeta(raw: unknown) {
  const payload = raw as
    | { current_page?: number; last_page?: number; data?: unknown }
    | undefined;
  const inner = payload?.data as
    | { current_page?: number; last_page?: number }
    | undefined;
  return {
    currentPage: payload?.current_page ?? inner?.current_page ?? 1,
    lastPage: payload?.last_page ?? inner?.last_page ?? 1,
  };
}
