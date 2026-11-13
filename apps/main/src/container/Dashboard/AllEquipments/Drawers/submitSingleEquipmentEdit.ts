import { format } from "date-fns";
import type { z } from "zod";
import {
  toApiEquipmentStatus,
  UNASSIGNED_API_EQUIPMENT_STATUS,
} from "@/components/AllEquipments/equipmentListStatus";
import type { EditEquipmentRequest, IEquipment } from "@/types/equipments";
import { toValidDate } from "@/utils/toValidDate";
import type { addSingleEquipmentSchema } from "./AddEquipment/SingleEquipment/validation";
import { formatEditPurchaseDateValue } from "./editSingleEquipmentForm";
import { EMPTY_EQUIPMENT_SPEC_FIELDS } from "./toEquipmentSpecFields";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

export const buildSingleEquipmentEditFormData = (
  data: FormValues,
  imageFile: Blob | string | undefined,
) => {
  const transformedObject = (data.properties ?? []).reduce(
    (acc, entry) => {
      const fieldName = entry?.fieldName;
      const fieldValue = entry?.fieldValue;
      if (!fieldName) return acc;
      const formattedKey =
        fieldName === "RAM"
          ? fieldName
          : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      acc[formattedKey] = fieldValue ?? "";
      return acc;
    },
    {} as Record<string, string>,
  );

  const formattedSpecs = Object.entries(transformedObject)
    .map(([key, value]) => `${key.toLowerCase()}:${String(value).trim()}`)
    .join(", ");

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("make", String(data.make ?? ""));
  formData.append("model", String(data.model ?? ""));
  formData.append("type", data.type);
  formData.append("source", "External");
  formData.append("state", data.state);
  formData.append(
    "status",
    toApiEquipmentStatus(
      String(data.status ?? UNASSIGNED_API_EQUIPMENT_STATUS),
    ),
  );
  formData.append("currency_id", String(data.currency_id ?? ""));
  if (data.country) formData.append("country", data.country);
  if (imageFile instanceof File) formData.append("image", imageFile);
  if (typeof imageFile === "string" && imageFile) {
    formData.append("image", imageFile);
  }
  formData.append("specs", formattedSpecs);
  formData.append("year", String(data.year ?? ""));
  if (data.purchase_date) {
    const purchaseDate = toValidDate(
      data.purchase_date as string | number | Date | null | undefined,
    );
    if (purchaseDate) {
      formData.append("purchase_date", format(purchaseDate, "yyyy-MM-dd"));
    }
  }
  formData.append("purchase_price", String(data.purchase_price ?? ""));
  if (data.serial_number) {
    formData.append("serial_number", String(data.serial_number));
  }
  if (data.office_id) {
    formData.append("office_id", String(data.office_id));
  }

  return formData;
};

export const buildEditEquipmentPayload = (
  companyId: string,
  equipmentId: string,
  data: FormValues,
  imageFile: Blob | string | undefined,
): EditEquipmentRequest => ({
  companyId,
  equipment_id: equipmentId,
  payload: buildSingleEquipmentEditFormData(data, imageFile),
});

export const mapEquipmentToEditForm = (
  equipment: IEquipment,
  countries: { id: string; name: string }[] | undefined,
) => {
  const formattedSpecs = Object.entries(equipment.specs ?? {}).map(
    ([key, value]) => ({
      fieldName: key.toLowerCase(),
      fieldValue: String(value),
    }),
  );

  const countryMatch = countries?.find(
    (country) => country.name === equipment.country,
  );

  return {
    title: equipment.title ?? "",
    serial_number: equipment.serial_number ?? "",
    make: equipment.make ?? "",
    model: equipment.model ?? "",
    year: equipment.year ?? "",
    type: equipment.type ?? "",
    state: equipment.state ?? "",
    country: countryMatch?.name ?? equipment.country ?? "",
    status: toApiEquipmentStatus(
      String(equipment.status ?? UNASSIGNED_API_EQUIPMENT_STATUS),
    ),
    assignee: equipment.assignee?.id ?? "",
    office_id: equipment.office?.id ?? "",
    properties:
      formattedSpecs.length > 0 ? formattedSpecs : EMPTY_EQUIPMENT_SPEC_FIELDS,
    purchase_date: formatEditPurchaseDateValue(equipment.purchase_date),
    purchase_price: equipment.purchase_price ?? "",
    currency_id: equipment.currency?.id ?? "",
    description: equipment.description ?? "",
  };
};
