"use client";

import EquipmentsDetailItem from "@/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail";
import { IEquipment } from "@/types/equipments";
import type { Disposition } from "@/types/offboard";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EmployeeEquipmentTable from "../tables/EmployeeEquipmentTable";

type Props = {
  equipmentsData: IEquipment[] | undefined;
  onBulkDisposition: (disposition: Disposition, deviceIds: string[]) => void;
  pendingDisposition?: Disposition | null;
};

const EquipmentSection = ({
  equipmentsData,
  onBulkDisposition,
  pendingDisposition = null,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = useParams();
  const employeeId = param?.employeeId as string;
  const equipmentId = searchParams.get("view_equipment_id");

  const openEquipmentsDetailItem = (equipment_id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view_equipment_id", equipment_id);
    router.push(`/dashboard/employees/${employeeId}?${params.toString()}`);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view_equipment_id");
    const query = params.toString();
    router.replace(
      query
        ? `/dashboard/employees/${employeeId}?${query}`
        : `/dashboard/employees/${employeeId}`,
    );
  };

  return (
    <>
      <EmployeeEquipmentTable
        equipments={equipmentsData ?? []}
        onEquipmentClick={openEquipmentsDetailItem}
        onBulkDisposition={onBulkDisposition}
        pendingDisposition={pendingDisposition}
      />
      <EquipmentsDetailItem
        isOpen={Boolean(equipmentId)}
        onClose={handleClose}
        onSave={() => null}
      />
    </>
  );
};

export default EquipmentSection;
