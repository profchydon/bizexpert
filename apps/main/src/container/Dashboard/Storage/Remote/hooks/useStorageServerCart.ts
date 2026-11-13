"use client";

import { useMemo } from "react";
import { useGetCartsQuery } from "@/api/baseQueries/cartApi/getCarts";
import { splitCartLines } from "@/api/baseQueries/cartApi/splitCartLines";
import { filterStorageCartLinesForCompany } from "@/api/baseQueries/cartApi/filterStorageCartLines";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { mapStorageCartLineToCheckoutItem } from "../utils/mapStorageCartLine";

export function useStorageServerCart() {
  const { getUserDetails } = useAuthUserDetail();
  const userId = getUserDetails()?.id;
  const companyId = useWorkspaceCompanyId();
  const { data: cartsRes, isLoading } = useGetCartsQuery(
    { companyId: companyId!, userId: userId! },
    { skip: !userId || !companyId },
  );

  const items = useMemo(() => {
    const storage = splitCartLines(cartsRes?.data).storage;
    return filterStorageCartLinesForCompany(storage, companyId).map(
      mapStorageCartLineToCheckoutItem,
    );
  }, [cartsRes?.data, companyId]);

  return { items, isLoading, userId, companyId };
}
