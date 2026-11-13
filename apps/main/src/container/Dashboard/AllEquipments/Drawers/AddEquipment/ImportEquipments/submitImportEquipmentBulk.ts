import { useCreateBulkEquipmentsMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/createBulkEquipments";
import type { IAddEquipment } from "@/types/equipments";
import { blobUrlToFile } from "@/utils/blobUrlToFile";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { validateArrayObjects } from "@/utils/validateArrayObjects";

type ImportEquipmentRow = IAddEquipment & { currency_id?: string };

type PreparedImportEquipment = Omit<
  ImportEquipmentRow,
  "id" | "imageUrl" | "status" | "image" | "details"
> & {
  status: string;
  details?: string;
  image?: File;
};

const REQUIRED_PROPERTIES = ["title", "type", "state", "currency_id"] as const;

export async function submitImportEquipmentBulk({
  equipmentData,
  companyId,
  createBulkEquipments,
  onSuccess,
}: {
  equipmentData: ImportEquipmentRow[];
  companyId: string;
  createBulkEquipments: ReturnType<typeof useCreateBulkEquipmentsMutation>[0];
  onSuccess: () => void;
}) {
  const equipmentWithoutType = equipmentData.filter(
    (item) => !item.type || item.type.trim() === "",
  );

  if (equipmentWithoutType.length > 0) {
    displayErrorMessage(
      "All equipment items must have a type assigned. Please edit any items with missing types before saving.",
    );
    return;
  }

  const validationResult = validateArrayObjects(equipmentData, [
    ...REQUIRED_PROPERTIES,
  ]);

  if (typeof validationResult === "string") {
    displayErrorMessage(validationResult);
    return;
  }

  const dataValue: PreparedImportEquipment[] = await Promise.all(
    equipmentData.map(
      async ({
        id,
        image,
        details,
        imageUrl,
        status,
        purchase_date,
        currency_id,
        ...rest
      }) => {
        const shared: PreparedImportEquipment = {
          details: Array.isArray(details) ? details.join(",") : undefined,
          status: !rest?.assignee ? "unassigned" : "Assigned",
          purchase_date,
          currency_id,
          ...rest,
        };

        if (!imageUrl) {
          return shared;
        }

        const blobUrl = await blobUrlToFile(imageUrl);
        return {
          ...shared,
          image: blobUrl,
        };
      },
    ),
  );

  const formData = new FormData();

  dataValue.forEach((item, index) => {
    formData.append(`equipments[${index}][title]`, item.title);
    if (item.description) {
      formData.append(`equipments[${index}][description]`, item.description);
    }
    formData.append(`equipments[${index}][make]`, item.make);
    formData.append(`equipments[${index}][model]`, item.model);
    formData.append(`equipments[${index}][type]`, item.type);
    if (item.country) {
      formData.append(`equipments[${index}][country]`, String(item.country));
    }
    formData.append(`equipments[${index}][state]`, item.state);
    formData.append(`equipments[${index}][status]`, item.status);
    if (item.assignee) {
      formData.append(`equipments[${index}][assignee]`, String(item.assignee));
    }
    formData.append(
      `equipments[${index}][currency_id]`,
      String(item.currency_id ?? ""),
    );
    if (item.image instanceof File) {
      formData.append(`equipments[${index}][image]`, item.image);
    }
    if (item.details) {
      formData.append(`equipments[${index}][other_details]`, item.details);
    }
    formData.append(`equipments[${index}][year]`, item.year);
    formData.append(
      `equipments[${index}][purchase_price]`,
      item.purchase_price,
    );
    if (item.purchase_date) {
      formData.append(
        `equipments[${index}][purchase_date]`,
        String(item.purchase_date),
      );
    }
    formData.append(`equipments[${index}][serial_number]`, item.serial_number);
  });

  await createBulkEquipments({
    companyId,
    payload: formData,
  } as never)
    .unwrap()
    .then(() => {
      displaySuccessMessage(
        "Equipment added successfully",
        "New equipment has been added to the company roster.",
      );
      onSuccess();
    })
    .catch(showApiError);
}
