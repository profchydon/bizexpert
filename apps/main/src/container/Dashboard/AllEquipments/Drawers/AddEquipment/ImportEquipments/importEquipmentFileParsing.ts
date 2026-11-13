import readXlsxFile from "read-excel-file";
import Papa from "papaparse";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { IAddEquipment } from "@/types/equipments";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { normalizeImportedEquipmentRow } from "./importEquipmentRowNormalize";

dayjs.extend(customParseFormat);

const PURCHASE_DATE_FORMATS = [
  "DD/MM/YYYY",
  "YYYY-MM-DD",
  "MM-DD-YYYY",
  "DD-MM-YYYY",
] as const;

const formatImportedPurchaseDate = (value: unknown): string | undefined => {
  if (value == null || value === "") return undefined;

  const parsed =
    value instanceof Date
      ? dayjs(value)
      : dayjs(String(value), [...PURCHASE_DATE_FORMATS]);

  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : undefined;
};

const getCurrencyIdByCode = (currenciesData: any[], code: string) => {
  const currency = currenciesData?.find((item: any) => item?.code === code);
  return currency ? currency.id : null;
};

export const filterImportedEquipmentItems = (
  items: IAddEquipment[],
): IAddEquipment[] => {
  const seenBySerial = new Set<string>();
  const seenByProperties = new Set<string>();

  return items.filter((item) => {
    const title = typeof item?.title === "string" ? item.title.trim() : "";
    const serialNumber =
      typeof item.serial_number === "string" ? item.serial_number.trim() : "";
    const uniqueKey = `${title}-${serialNumber}`;

    if (serialNumber) {
      if (seenBySerial.has(serialNumber)) return false;
      seenBySerial.add(serialNumber);
      return true;
    }

    if (title) {
      const duplicateTitleSerialNumber = Array.from(seenByProperties).some(
        (key) => {
          const [, storedTitle, storedSerialNumber] = key.split("-");
          return storedTitle === title && storedSerialNumber === serialNumber;
        },
      );
      if (duplicateTitleSerialNumber || seenByProperties.has(uniqueKey)) {
        return false;
      }
      seenByProperties.add(uniqueKey);
      return true;
    }

    return false;
  });
};

const transformImportedRows = (
  rows: IAddEquipment[],
  currenciesData: any[] | undefined,
) => {
  if (!currenciesData) return null;

  return rows.map((item: IAddEquipment, index) => {
    const normalized = normalizeImportedEquipmentRow(item, index);
    const currencyCode = String(
      (normalized as { currency_id?: string }).currency_id ?? "",
    );
    const newCurrencyId = getCurrencyIdByCode(currenciesData, currencyCode);
    const formattedDate = formatImportedPurchaseDate(normalized?.purchase_date);
    return {
      ...normalized,
      currency_id: newCurrencyId,
      ...(formattedDate ? { purchase_date: formattedDate } : {}),
    };
  });
};

const emptySheetError = () =>
  displayErrorMessage(
    "Empty instance:",
    "The uploaded sheet is either empty or does not contain corresponding id as provided in the sample sheet. Please, download the sample sheet to check for valid instance and try again.",
  );

const applyImportedRows = (
  rows: IAddEquipment[],
  currenciesData: any[] | undefined,
  onImported: (rows: IAddEquipment[]) => void,
) => {
  const filtered = filterImportedEquipmentItems(rows);
  if (filtered.length < 1) {
    emptySheetError();
    return;
  }
  const transformed = transformImportedRows(filtered, currenciesData);
  if (transformed) onImported(transformed as IAddEquipment[]);
};

export const parseImportEquipmentFiles = async (
  acceptedFiles: File[],
  options: {
    defaultCurrencyCode?: string;
    currenciesData?: any[];
    onImported: (rows: IAddEquipment[]) => void;
  },
) => {
  const file = acceptedFiles[0];
  const fileType = file?.type;

  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    const res = await readXlsxFile(file);
    const keys = res[0];
    const objectsArray = res.slice(1).map((entry) => {
      const obj: Record<string, unknown> = {};
      keys.forEach((key: any, index) => {
        obj[key] = entry[index];
      });
      const currency_id = obj?.currency_id || options.defaultCurrencyCode;
      if (currency_id) obj.currency_id = currency_id;
      return obj as unknown as IAddEquipment;
    });
    applyImportedRows(objectsArray, options.currenciesData, options.onImported);
    return;
  }

  if (fileType === "text/csv") {
    Papa.parse(file, {
      worker: true,
      header: true,
      complete: (result) => {
        const data = result.data as Record<string, unknown>[];
        if (!Array.isArray(data) || data.length === 0) {
          displayErrorMessage(
            "Invalid CSV",
            "The uploaded CSV file is either empty or has an invalid format.",
          );
          return;
        }

        const keys = Object.keys(data[0] ?? {});
        const objectsArray = data.map((entry) => {
          const obj: Record<string, unknown> = {};
          keys.forEach((key) => {
            obj[key] = entry[key];
          });
          const currency_id = obj?.currency_id || options.defaultCurrencyCode;
          if (currency_id) obj.currency_id = currency_id;
          return obj as unknown as IAddEquipment;
        });
        applyImportedRows(
          objectsArray,
          options.currenciesData,
          options.onImported,
        );
      },
      error: () => {
        displayErrorMessage(
          "Unsupported file format",
          "Please, try again using CSV file format or Excel!",
        );
      },
    });
    return;
  }

  displayErrorMessage(
    "Unsupported file format",
    "Please, try again using CSV file format or Excel!",
  );
};

export const downloadEquipmentImportTemplate = () => {
  const link = document.createElement("a");
  link.href = "/Equipment-Import-Template.xlsx";
  link.download = "Equipment-Import-Template.xlsx";
  link.click();
};
