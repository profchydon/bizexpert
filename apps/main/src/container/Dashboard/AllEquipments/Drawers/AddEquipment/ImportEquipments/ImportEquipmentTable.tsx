import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "@/components/base/buttons/button";
import { useCreateBulkEquipmentsMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/createBulkEquipments";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useAppDispatch, useAppSelector } from "@/store";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  resetImportedEquipment,
  setImportedEquipment,
} from "@/store/slices/equipmentSlice";
import type { IAddEquipment } from "@/types/equipments";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { addEquipmentFooterBorderClass } from "../addEquipmentSlideoutResize";
import { ImportEquipmentPreviewTable } from "./ImportEquipmentPreviewTable";
import { submitImportEquipmentBulk } from "./submitImportEquipmentBulk";

interface Props {
  onClose: () => void;
  clearArrayData: () => void;
}

const ImportEquipmentTable: FC<Props> = ({ clearArrayData, onClose }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const equipmentData = useAppSelector(
    (state) => state.persistedReducers.equipment?.importedEquipment,
  ) as IAddEquipment[];

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data: getEmployees } = useGetEmployeesQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );
  const employeeData = getEmployees?.data?.data as
    Array<{ id: string; first_name?: string; last_name?: string }> | undefined;

  const [createBulkEquipments, createBulkEquipmentsProps] =
    useCreateBulkEquipmentsMutation();

  const resolveAssigneeName = (assigneeId?: string | null) => {
    if (!assigneeId) return null;
    const employee = employeeData?.find((item) => item.id === assigneeId);
    if (!employee) return null;
    return `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim();
  };

  const removeEquipment = (equipmentId: string) => {
    const nextRows = equipmentData.filter(
      (equipment) => String(equipment.id) !== String(equipmentId),
    );
    dispatch(setImportedEquipment(nextRows as IAddEquipment[]));
  };

  const handleCancel = () => {
    router.replace("/dashboard/all-equipments");
    clearArrayData();
    dispatch(resetImportedEquipment());
    onClose();
  };

  const handleSubmit = async () => {
    if (!companyId) return;
    await submitImportEquipmentBulk({
      equipmentData,
      companyId: companyId,
      createBulkEquipments,
      onSuccess: handleCancel,
    });
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pb-4 pt-6 md:px-6">
        <ImportEquipmentPreviewTable
          rows={equipmentData}
          resolveAssigneeName={resolveAssigneeName}
          onRemove={removeEquipment}
          onEdit={(equipmentId) =>
            router.replace(
              `/dashboard/all-equipments?equipment_id=${equipmentId}&edit=true`,
            )
          }
        />
      </div>

      <div
        className={`flex w-full shrink-0 items-center justify-end gap-3 px-6 py-4 ${addEquipmentFooterBorderClass}`}
      >
        <Button
          size="md"
          color="secondary"
          onPress={handleCancel}
          data-testid="importequipmenttable-button"
        >
          Cancel
        </Button>
        <Button
          size="md"
          isDisabled={createBulkEquipmentsProps.isLoading}
          isLoading={createBulkEquipmentsProps.isLoading}
          onPress={handleSubmit}
          data-testid="importequipmenttable-button-2"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ImportEquipmentTable;
