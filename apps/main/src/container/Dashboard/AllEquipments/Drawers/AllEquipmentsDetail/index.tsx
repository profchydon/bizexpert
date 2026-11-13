import React from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { EquipmentsDetailItemTimeline } from "./EquipmentsDetailItemTimeline";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetSingleEquipmentQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getSingleEquipment";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import formatAmount from "@/utils/formatAmount";
import AllEquipmentDetailList from "./AllEquipmentDetailList";
import SerialNumberToggle from "@/components/SerialNumberToggle";
import { getInitials } from "@/utils/getInitials";
import PageState from "@/components/PageState";
import { Separator } from "@/components/ui/separator";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { ICatalog } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  formatSpecification,
  resolveEquipmentType,
} from "./equipmentDetailFormat";
import EquipmentAssociatedDocuments from "./EquipmentAssociatedDocuments";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EquipmentsDetailItem: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const param = useSearchParams();
  const equipmentId = param.get("view_equipment_id") as string;

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const {
    data: getSingleEmployee,
    isLoading,
    isError,
  } = useGetSingleEquipmentQuery(
    { companyId: companyId!, equipmentId: equipmentId! },
    { skip: !companyId || !equipmentId },
  );

  const equipmentsData = getSingleEmployee?.data;

  const { data: assetTypesRes } = useGetAssetTypesQuery();
  const productType = resolveEquipmentType(
    equipmentsData?.type,
    assetTypesRes?.data,
  );
  const specification = formatSpecification({
    description: equipmentsData?.description,
    otherDetails: equipmentsData?.other_details,
  });

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      drawerTitle={`${equipmentsData?.title || ""}`}
      drawerDescription=""
      hideDefaultFooterBtn
      data-testid="allequipmentsdetail-drawerright"
    >
      <PageState isLoading={isLoading} isError={isError}>
        <div className="flex flex-col flex-grow mb-24 gap-6">
          <div className="flex flex-col gap-2">
            <AllEquipmentDetailList title="Assigned to" />
            {equipmentsData?.assignee ? (
              <div className="flex flex-row gap-x-4 border-b  pb-5">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-gray-600 bg-gray-100">
                    {getInitials(`${equipmentsData?.assignee?.name || ""}`)}
                  </AvatarFallback>
                </Avatar>
                <AllEquipmentDetailList
                  titleStyle="text-gray-900"
                  title={equipmentsData?.assignee?.name}
                  description={
                    equipmentsData?.assignee?.email || (
                      <Badge variant="red">Not available</Badge>
                    )
                  }
                />
              </div>
            ) : (
              <Badge variant="red">Not available</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <AllEquipmentDetailList
              title="Product type"
              description={
                productType || <Badge variant="red">Not available</Badge>
              }
            />
            <AllEquipmentDetailList
              title="Status"
              badge
              status={equipmentsData?.status as any}
            />
            <AllEquipmentDetailList
              title="Catalog"
              descriptionStyle="text-primary-600 font-medium"
              description={
                (equipmentsData?.catalog as ICatalog)?.name ?? ("" as string)
              }
            />
            <AllEquipmentDetailList
              title="Usage Time"
              description="Not available"
            />
            <AllEquipmentDetailList
              title="Purchase date"
              description={
                !equipmentsData?.purchase_date ? (
                  <Badge variant="red">Not available</Badge>
                ) : (
                  dayjs(equipmentsData?.purchase_date).format("MMM DD, YYYY")
                )
              }
            />
            <AllEquipmentDetailList
              title="Purchase price"
              description={`${equipmentsData?.currency?.symbol || ""}
                  ${formatAmount(String(equipmentsData?.purchase_price))}`}
            />

            <AllEquipmentDetailList
              className="col-span-2"
              title="Serial number"
            >
              <SerialNumberToggle
                serialNumber={equipmentsData?.serial_number ?? "N/A"}
              />
            </AllEquipmentDetailList>
            {/* <AllEquipmentDetailList className="col-span-2" title="Hash code">
              <SerialNumberToggle
                serialNumber={`${equipmentsData?.hash_code || "Not available"}`}
              />
            </AllEquipmentDetailList> */}
            <AllEquipmentDetailList
              className="col-span-2"
              title="Specification"
              description={
                specification || <Badge variant="red">Not available</Badge>
              }
            />
          </div>

          {(equipmentsData?.history?.length as number) > 0 && (
            <>
              <Separator className="border-gray-200 my-2 border-[0.5px]" />

              <div className="flex flex-col ">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    Equipment history
                  </span>
                  <span className="font-normal text-gray-600 text-sm">
                    View the history of this equipment
                  </span>
                </div>
                <EquipmentsDetailItemTimeline data={equipmentsData?.history} />
              </div>
            </>
          )}

          <EquipmentAssociatedDocuments hashCode={equipmentsData?.hash_code} />

          <div className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 ">
            <div className="grid place-content-end my-auto h-full w-full">
              <Button
                className="text-sm font-semibold"
                variant="outline"
                onClick={onClose}
                data-testid="allequipmentsdetail-button"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </PageState>
    </DrawerRight>
  );
};

export default EquipmentsDetailItem;
