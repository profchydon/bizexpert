"use client";

import { useCallback, useRef, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { axiosServer } from "@/api/interceptor/axios";
import displayErrorMessage from "@/utils/displayErrorMessage";
import type { InventoryFilters } from "../types/storage";
import { buildInStorageExportParams } from "../utils/buildInStorageExportParams";
import { buildInStorageSelectedExportBody } from "../utils/buildInStorageSelectedExportBody";
import {
  buildStorageInventoryExportUrl,
  buildStorageInventorySelectedExportUrl,
  downloadStorageInventoryBlob,
} from "../utils/exportStorageInventory";
import { getStorageExportAuth } from "../utils/getStorageExportAuth";
import { parseStorageExportErrorBlob } from "../utils/parseStorageExportErrorBlob";

export interface StorageInventoryFilteredExportInput {
  filters: InventoryFilters;
  sort: SortDescriptor;
}

export function useStorageInventoryExport() {
  const [isExporting, setIsExporting] = useState(false);
  const isExportingRef = useRef(false);

  const beginExport = () => {
    if (isExportingRef.current) return false;
    isExportingRef.current = true;
    setIsExporting(true);
    return true;
  };

  const endExport = () => {
    isExportingRef.current = false;
    setIsExporting(false);
  };

  const exportFilteredInventory = useCallback(
    async ({ filters, sort }: StorageInventoryFilteredExportInput) => {
      const { companyId, token } = getStorageExportAuth();
      if (!companyId || !token) {
        displayErrorMessage("Unable to export storage inventory.");
        return false;
      }
      if (!beginExport()) return false;

      try {
        const response = await axiosServer.get<Blob>(
          buildStorageInventoryExportUrl(
            companyId,
            buildInStorageExportParams({ filters, sort }),
          ),
          {
            responseType: "blob",
            headers: {
              Accept: "text/csv",
              Authorization: `Bearer ${token}`,
            },
            validateStatus: (status) => status < 500,
          },
        );

        if (response.status >= 400) {
          displayErrorMessage("Unable to export storage inventory.");
          return false;
        }

        downloadStorageInventoryBlob(
          response.data,
          response.headers["content-disposition"],
        );
        return true;
      } catch {
        displayErrorMessage("Unable to export storage inventory.");
        return false;
      } finally {
        endExport();
      }
    },
    [],
  );

  const exportSelectedInventory = useCallback(
    async (equipmentIds: string[]) => {
      const { companyId, token } = getStorageExportAuth();
      if (!companyId || !token || !equipmentIds.length) {
        displayErrorMessage("Unable to export storage inventory.");
        return false;
      }
      if (!beginExport()) return false;

      try {
        const response = await axiosServer.post<Blob>(
          buildStorageInventorySelectedExportUrl(companyId),
          buildInStorageSelectedExportBody(equipmentIds),
          {
            responseType: "blob",
            headers: {
              Accept: "text/csv",
              Authorization: `Bearer ${token}`,
            },
            validateStatus: (status) => status < 500,
          },
        );

        if (response.status >= 400) {
          const apiMessage = await parseStorageExportErrorBlob(response.data);
          displayErrorMessage(
            apiMessage ?? "Unable to export storage inventory.",
          );
          return false;
        }

        downloadStorageInventoryBlob(
          response.data,
          response.headers["content-disposition"],
        );
        return true;
      } catch {
        displayErrorMessage("Unable to export storage inventory.");
        return false;
      } finally {
        endExport();
      }
    },
    [],
  );

  return { exportFilteredInventory, exportSelectedInventory, isExporting };
}
