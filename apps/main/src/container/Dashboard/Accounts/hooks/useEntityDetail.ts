"use client";

import { useMemo } from "react";
import { useGetEntityQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntity";
import {
  buildEntityDetailViewModel,
  type EntityDetailViewModel,
} from "../utils/buildEntityDetailViewModel";

export type EntityDetailState = {
  detail: EntityDetailViewModel | undefined;
  isLoading: boolean;
  isError: boolean;
  isNotFound: boolean;
};

export function useEntityDetail(entityId: string): EntityDetailState {
  const query = useGetEntityQuery({ entityId }, { skip: !entityId });

  const detail = useMemo(() => {
    const record = query.data?.data;
    if (!record) return undefined;
    return buildEntityDetailViewModel(record);
  }, [query.data]);

  const errorStatus = query.error
    ? (query.error as { status?: number }).status
    : undefined;

  return {
    detail,
    isLoading: query.isLoading,
    isError: query.isError,
    isNotFound: errorStatus === 404,
  };
}
