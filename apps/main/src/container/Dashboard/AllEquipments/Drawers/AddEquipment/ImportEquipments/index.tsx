"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback, useEffect, useState } from "react";
import ImportEquipmentTable from "./ImportEquipmentTable";
import EditImportedEquipment from "./EditImportedEquipment";
import ImportEquipmentUploadFooter from "./ImportEquipmentUploadFooter";
import ImportEquipmentUploadPanel from "./ImportEquipmentUploadPanel";
import {
  downloadEquipmentImportTemplate,
  parseImportEquipmentFiles,
} from "./importEquipmentFileParsing";
import { useGetCurrenciesQuery } from "@/api/baseQueries/currenciesApi/getCurrencies";
import { companyBillingCurrency } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetImportedEquipment,
  setImportedEquipment,
} from "@/store/slices/equipmentSlice";

interface Props {
  onClose: () => void;
}

const ImportEquipments: FC<Props> = ({ onClose }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const getEditInstance = searchParams.get("edit");
  const getEditIDInstance = searchParams.get("equipment_id");
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const [isMounted, setIsMounted] = useState(false);
  const equipmentData =
    (useAppSelector(
      (state) => state.persistedReducers.equipment?.importedEquipment,
    ) as never[]) || [];

  const { data: getCurrencies, isLoading, isError } = useGetCurrenciesQuery();
  const currenciesData = getCurrencies?.data;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      await parseImportEquipmentFiles(acceptedFiles, {
        defaultCurrencyCode: companyBillingCurrency(company),
        currenciesData,
        onImported: (rows) => dispatch(setImportedEquipment(rows)),
      });
    },
    [
      company?.billing_currency,
      company?.billing_currency_code,
      currenciesData,
      dispatch,
    ],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clearEditParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    params.delete("equipment_id");
    const query = params.toString();
    router.replace(
      query
        ? `/dashboard/all-equipments?${query}`
        : "/dashboard/all-equipments",
    );
  }, [router, searchParams]);

  return (
    <PageState isLoading={isLoading} isError={isError}>
      {isMounted && (
        <>
          {equipmentData?.length < 1 && (
            <div className="flex min-h-0 flex-1 flex-col">
              <ImportEquipmentUploadPanel
                onDownloadTemplate={downloadEquipmentImportTemplate}
                onDropFiles={(files) => void onDrop(Array.from(files))}
              />
              <ImportEquipmentUploadFooter onClose={onClose} />
            </div>
          )}

          {equipmentData?.length > 0 && !Boolean(getEditInstance) && (
            <ImportEquipmentTable
              onClose={onClose}
              clearArrayData={() => dispatch(resetImportedEquipment())}
            />
          )}

          {Boolean(getEditInstance) && getEditIDInstance && (
            <EditImportedEquipment
              equipment_id={getEditIDInstance}
              onBack={clearEditParams}
            />
          )}
        </>
      )}
    </PageState>
  );
};

export default ImportEquipments;
