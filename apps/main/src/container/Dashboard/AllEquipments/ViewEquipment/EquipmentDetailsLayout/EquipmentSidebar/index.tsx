import { IEquipment } from "@/types/equipments";
import React from "react";
import EquipmentImage from "./EquipmentImage";
import { EquipmentDeviceHeading, EquipmentStatusBand } from "./EquipmentInfo";
import EquipmentDetailsList from "./EquipmentDetailsList";
import SupportSection from "@/components/SupportSection";
import ExpectedLifespan from "@/components/DeviceRefresh/ExpectedLifespan";
import {
  viewEquipmentDeviceBodyClass,
  viewEquipmentDeviceCardClass,
} from "../../viewEquipmentClasses";
import EquipmentDetailsActions from "./EquipmentDetailsActions";
import EquipmentSidebarDrawers from "./EquipmentSidebarDrawers";
import { useParams, useRouter } from "next/navigation";
import { IUserRole } from "@/utils/hasAccess";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useEquipmentSidebarActions } from "./useEquipmentSidebarActions";

interface FormattedItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  equipment: IEquipment;
  allEquipment: IEquipment[];
  employeeDataOptions: FormattedItem[];
  currentEmployee: any;
}

const EquipmentSidebar: React.FC<Props> = ({
  equipment,
  allEquipment,
  employeeDataOptions,
  currentEmployee,
}) => {
  const param = useParams();
  const router = useRouter();
  const equipID = param?.equipmentId as string;
  const { getUserDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();
  const { offboardingData, drawerState, drawerHandlers, actionHandlers } =
    useEquipmentSidebarActions(equipment);

  return (
    <div className="flex flex-col gap-4">
      <div className={viewEquipmentDeviceCardClass}>
        <EquipmentImage
          image={equipment?.image_url}
          name={equipment?.title}
          type={equipment?.type}
        />
        <EquipmentStatusBand status={equipment.status} />

        <div className={viewEquipmentDeviceBodyClass}>
          <EquipmentDeviceHeading
            name={equipment?.title}
            equipment={equipment}
          />
          {equipment?.refresh_details ? (
            <ExpectedLifespan
              expectedLifespan={equipment?.time_left_before_refresh ?? ""}
              startDate={equipment?.purchase_date ?? ""}
              isDue={["Due", "Overdue"].includes(
                equipment?.refresh_details?.refresh_status ?? "",
              )}
            />
          ) : null}
          <EquipmentDetailsList
            usage={{
              duration: `${equipment?.usage_duration || ""}`,
              insuranceExpiry: `${equipment?.insurance_expiry_in || ""}`,
              storageDuration: `${equipment?.storage_duration || ""}`,
              equipmentStatus: `${equipment?.status || ""}`,
            }}
          />

          <EquipmentDetailsActions
            item={{
              id: equipment?.id as string,
              assignee: equipment?.assignee as any,
              status: equipment?.status,
              country: equipment?.country as string,
              type: equipment?.type,
              title: equipment?.title,
              source: equipment?.source,
              telemetry_ownership: equipment?.telemetry_ownership,
            }}
            onTransferEquipment={actionHandlers.handleTransferEquipment}
            onStoreEquipment={actionHandlers.handleStoreEquipment}
            onAddEquipment={actionHandlers.toggleNote}
            onSellEquipment={actionHandlers.handleSellEquipment}
            offboardingData={offboardingData as unknown as any}
            userRole={user?.role as IUserRole}
          />
        </div>
      </div>

      <SupportSection status={equipment?.status} />

      <EquipmentSidebarDrawers
        equipID={equipID}
        equipment={equipment}
        allEquipment={allEquipment}
        companyId={companyId as string}
        employeeDataOptions={employeeDataOptions}
        currentEmployee={currentEmployee}
        isSelectReceiverDateOpen={drawerState.isSelectReceiverDateOpen}
        isStorageDurationOpen={drawerState.isStorageDurationOpen}
        isSalesPriceOpen={drawerState.isSalesPriceOpen}
        isSelectReceiverOpen={drawerState.isSelectReceiverOpen}
        isSelectReceiverFlowTypeOpen={drawerState.isSelectReceiverFlowTypeOpen}
        isSystemReassginOpen={drawerState.isSystemReassginOpen}
        isAddNoteOpen={drawerState.isAddNoteOpen}
        selectedReceiverFlow={drawerState.selectedReceiverFlow}
        onSelectReceiverDateClose={drawerHandlers.handleCollectDateClose}
        onSelectReceiverDateNext={() =>
          router.push("/dashboard/offboarding/order-summary")
        }
        onStorageDurationClose={drawerHandlers.onStorageDurationClose}
        onStorageDurationNext={drawerHandlers.handleStorageDurageNext}
        onSalesPriceClose={drawerHandlers.onSalesPriceClose}
        onSalesPriceNext={drawerHandlers.handleSalesPriceNext}
        onSelectReceiverClose={drawerHandlers.onSelectReceiverClose}
        onSelectReceiverNext={drawerHandlers.handleSelectReceiverNext}
        onSelectReceiverFlowTypeClose={
          drawerHandlers.onSelectReceiverFlowTypeClose
        }
        setSelectedReceiverFlow={drawerHandlers.setSelectedReceiverFlow}
        onSelectReceiverFlowContinue={
          drawerHandlers.onSelectReceiverFlowContinue
        }
        onSystemReassignClose={drawerHandlers.onSystemReassignClose}
        onAddNoteClose={drawerHandlers.onAddNoteClose}
      />
    </div>
  );
};

export default EquipmentSidebar;
