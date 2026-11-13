import { IAddEquipment } from "@/types/equipments";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import readXlsxFile from "read-excel-file";
import Papa from "papaparse";
import EmptyUploadState from "./EmptyUploadState";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { download02_icon_primary } from "@/assets/icons";
import UploadEquipmentTable from "./UploadEquipmentTable";
import EditUploadedEquipment from "./EditUploadedEquipments";
import { useGetCurrenciesQuery } from "@/api/baseQueries/currenciesApi/getCurrencies";
import { companyBillingCurrency } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetImportedEquipment,
  setImportedEquipment,
} from "@/store/slices/equipmentSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import routes from "@/routes";

interface Props {
  onClose: () => void;
}
const UploadEquipments: FC<Props> = ({ onClose }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const getEditInstance = searchParams.get("#");
  const getEditIDInstance = searchParams.get("#");
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingCurrency = companyBillingCurrency(company);

  const [isMounted, setIsMounted] = useState(false);
  const equipmentData =
    (useAppSelector(
      (state) => state.persistedReducers.equipment?.importedEquipment,
    ) as IAddEquipment[]) || [];

  const { data: getCurrencies, isLoading, isError } = useGetCurrenciesQuery();
  const currenciesData = getCurrencies?.data;

  const getCurrencyIdByCode = (currenciesData: any, code: string) => {
    const currency = currenciesData?.find(
      (currency: any) => currency?.code === code,
    );
    return currency ? currency.id : null;
  };

  const filterItems = (items: IAddEquipment[]): IAddEquipment[] => {
    const seenBySerial = new Set<string>();
    const seenByProperties = new Set<string>();

    return items.filter((item) => {
      const title = typeof item?.title === "string" ? item.title.trim() : "";
      const serialNumber =
        typeof item.serial_number === "string" ? item.serial_number.trim() : "";

      const hasTitle = title !== "";
      const hasSerialNumber = serialNumber !== "";

      // Create a unique key for the combination of id, title, and serial_number
      const uniqueKey = `${title}-${serialNumber}`;

      if (hasSerialNumber) {
        // Check uniqueness by serial_number if it's valid
        if (!seenBySerial.has(serialNumber)) {
          seenBySerial.add(serialNumber);
          return true;
        } else {
          // Serial number already exists, so remove the duplicate
          return false;
        }
      } else if (hasTitle) {
        // Check uniqueness by combination of id, title, and serial_number when serial_number is missing
        const duplicateTitleSerialNumber = Array.from(seenByProperties).some(
          (key) => {
            const [, storedTitle, storedSerialNumber] = key.split("-");
            return storedTitle === title && storedSerialNumber === serialNumber;
          },
        );

        // If no duplicates in title + serial_number, add this item
        if (!duplicateTitleSerialNumber && !seenByProperties.has(uniqueKey)) {
          seenByProperties.add(uniqueKey);
          return true;
        } else {
          // Skip duplicate by title + serial_number (even if id differs)
          return false;
        }
      }

      // If no valid serial_number, id, or title, skip the item
      return false;
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const fileType = file?.type;

      if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        // Handle Excel file with streaming
        await readXlsxFile(file).then((res) => {
          const keys = res[0];
          const objectsArray = res.slice(1).map((entry) => {
            let obj: any = {};
            keys.forEach((key: any, index) => {
              obj[key] = entry[index];
            });
            const currency_id = obj?.currency_id || billingCurrency;
            if (currency_id) {
              obj.currency_id = currency_id;
            }
            return obj as IAddEquipment;
          });

          const filterEmptyProperties = filterItems(objectsArray);

          if (filterEmptyProperties?.length < 1) {
            return displayErrorMessage(
              `Empty instance:`,
              `The uploaded sheet is either empty or does not contain corresponding id as provided in the sample sheet. Please, download the sample sheet to check for valid instance and try again.`,
            );
          }

          const transformBulkData = !currenciesData
            ? null
            : filterEmptyProperties?.map((item: any) => {
                const newCurrencyId = getCurrencyIdByCode(
                  currenciesData,
                  item?.currency_id,
                );
                return {
                  ...item,
                  currency_id: newCurrencyId,
                };
              });

          dispatch(setImportedEquipment(transformBulkData as IAddEquipment[]));
        });
      } else if (fileType === "text/csv") {
        // Handle CSV file with streaming
        Papa.parse(file, {
          worker: true,
          header: true,
          complete: (result) => {
            const data: any = result.data;

            if (!Array.isArray(data) || data.length === 0) {
              return displayErrorMessage(
                "Invalid CSV",
                "The uploaded CSV file is either empty or has an invalid format.",
              );
            }

            const keys = Object.keys(data[0]); // Extract keys from the first row (header)
            if (!Array.isArray(keys)) {
              return displayErrorMessage(
                "Invalid CSV",
                "The CSV header row is not in the expected format.",
              );
            }

            const objectsArray = data.map((entry: any) => {
              let obj: any = {};
              keys.forEach((key: any) => {
                obj[key] = entry[key]; // Map each row to the header keys
              });

              const currency_id = obj?.currency_id || billingCurrency;
              if (currency_id) {
                obj.currency_id = currency_id;
              }

              return obj as IAddEquipment;
            });

            const filterEmptyProperties = filterItems(objectsArray);

            if (filterEmptyProperties?.length < 1) {
              return displayErrorMessage(
                `Empty instance:`,
                `The uploaded sheet is either empty or does not contain corresponding id as provided in the sample sheet. Please, download the sample sheet to check for valid instance and try again.`,
              );
            }

            const transformBulkData = !currenciesData
              ? null
              : filterEmptyProperties.map((item: any) => {
                  const newCurrencyId = getCurrencyIdByCode(
                    currenciesData,
                    item?.currency_id,
                  );
                  return {
                    ...item,
                    currency_id: newCurrencyId,
                  };
                });

            dispatch(
              setImportedEquipment(transformBulkData as IAddEquipment[]),
            );
          },
          error: (err) => {
            displayErrorMessage(
              "Unsupported file format",
              "Please, try again using CSV file format or Excel!",
            );
          },
        });
      } else {
        displayErrorMessage(
          "Unsupported file format",
          "Please, try again using CSV file format or Excel!",
        );
      }
    },
    [currenciesData, router],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
  });

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
    e.preventDefault();
    router.push(routes.IMPORT_EQUIPMENT_STORAGE);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDownload = () => {
    const filePath = "/Equipment-Import-Template.xlsx";
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "Equipment-Import-Template.xlsx";
    link.click();
  };

  return (
    <PageState isLoading={isLoading} isError={isError}>
      {isMounted && (
        <>
          {equipmentData?.length < 1 && (
            <div className="flex flex-col">
              <div className="border border-gray-200 flex flex-col rounded-xl bg-white mx-6 py-16 lg:py-0 lg:w-[824px] lg:h-[470px]">
                <div
                  className="grid place-content-center m-auto"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <EmptyUploadState />
                </div>
              </div>

              <div className="fixed bottom-0 w-full py-4 px-6 border-t bg-white border-gray-200">
                <div className="flex flex-row justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          className="text-sm flex gap-x-2 items-center font-semibold text-primary-700"
                          variant="outline"
                          onClick={() => {
                            if (equipmentData?.length < 1) {
                              handleDownload();
                            }
                          }}
                          data-testid="importlayout-button"
                        >
                          <Image
                            src={download02_icon_primary}
                            alt="download-icon"
                          />
                          Download Template
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent side="top" sideOffset={6}>
                        <strong>Download template here</strong>
                        <p className="w-44">
                          Here you can download the CSV file used to import your
                          asset information
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    type="button"
                    className="text-sm font-semibold "
                    variant="outline"
                    onClick={handleCancel}
                    data-testid="importlayout-button-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {equipmentData?.length > 0 && !Boolean(getEditInstance) && (
            <UploadEquipmentTable
              onClose={onClose}
              clearArrayData={() => dispatch(resetImportedEquipment())}
            />
          )}

          {Boolean(getEditInstance) && getEditIDInstance && (
            <EditUploadedEquipment
              isOpen={true}
              onClose={() => {}}
              edit_instance={true}
            />
          )}
        </>
      )}
    </PageState>
  );
};

export default UploadEquipments;
