import readXlsxFile from "read-excel-file";
import Papa from "papaparse";
import type { IEmployees } from "@/types/employees";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { filterImportedEmployees } from "./filterImportedEmployees";

type ParseOptions = {
  countryName?: string;
  onParsed: (employees: IEmployees[]) => void;
};

export async function parseImportEmployeeFile(
  file: File,
  options: ParseOptions,
) {
  const { countryName, onParsed } = options;

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    const rows = await readXlsxFile(file);
    const keys = rows[0];
    const objectsArray = rows.slice(1).map((entry) => {
      const obj: Record<string, unknown> = {};
      keys.forEach((key, index) => {
        obj[String(key)] = entry[index];
      });
      if (countryName && !obj.country_id) obj.country_id = countryName;
      return obj as unknown as IEmployees;
    });
    return finalizeImport(objectsArray, onParsed);
  }

  if (file.type === "text/csv") {
    Papa.parse(file, {
      worker: true,
      header: true,
      complete: (result) => {
        const data = result.data;
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
            obj[key] = (entry as Record<string, unknown>)[key];
          });
          if (countryName && !obj.country_id) obj.country_id = countryName;
          return obj as unknown as IEmployees;
        });
        finalizeImport(objectsArray, onParsed);
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
}

function finalizeImport(
  objectsArray: IEmployees[],
  onParsed: (employees: IEmployees[]) => void,
) {
  const filtered = filterImportedEmployees(objectsArray);
  if (filtered.length < 1) {
    displayErrorMessage(
      "Empty instance:",
      "The uploaded sheet is either empty or does not contain corresponding id as provided in the sample sheet. Please, download the sample sheet to check for valid instance and try again.",
    );
    return;
  }
  onParsed(filtered);
}
