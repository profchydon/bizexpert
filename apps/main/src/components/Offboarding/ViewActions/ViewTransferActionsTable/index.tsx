import { FC, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageState from "@/components/PageState";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Offboard_asset } from "@/types/offboarding";
import ViewTransferActions from "./tableActions";
import ViewTransferActionsColumn from "./tableColumn";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSearchParams } from "next/navigation";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { IEquipment } from "@/types/equipments";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { IEmployees } from "@/types/employees";
import useTransformEmployeeToValueLabel from "@/hooks/useTransformEmployeeToValueLabel";
import { UserIcon } from "lucide-react";
import { useAppDispatch } from "@/store";
import { deleteOffboardingData } from "@/store/slices/offboardingSlice";
import SelectAReceiver from "@/components/AllEquipments/Drawers/SelectAReceiver";
import routes from "@/routes";
import TransferActionsEdit from "@/components/AllEquipments/Drawers/TransferActionsEdit";

interface Props {
  data: Offboard_asset[];
  baseRoute: string;
}
const ViewTransferActionsTable: FC<Props> = ({ data, baseRoute }) => {
  const companyId = useWorkspaceCompanyId();
  const { push } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const equipID = searchParams.get("equip_id");
  const [isEditTransfer, setEditTransfer] = useState<boolean>(false);
  const [isSelectReceiverOpen, setIsSelectReceiverOpen] = useState(false);

  const {
    data: getEquipments,
    isLoading: equipment_isLoading,
    isError: equipment_isError,
  } = useGetEquipmentsQuery(
    {
      companyId: companyId!,
      params: {
        assigned: true,
        source: "all",
      },
    },
    { skip: !companyId, refetchOnMountOrArgChange: false },
  );

  const equipmentsData = useMemo(
    () => (getEquipments?.data?.data as IEquipment[]) || [],
    [getEquipments],
  );

  const { data: getEmployees } = useGetEmployeesQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );
  const employeeData = useMemo(
    () => (getEmployees?.data?.data as IEmployees[]) || [],
    [getEmployees],
  );

  const employeeDataOptions = useTransformEmployeeToValueLabel({
    data: employeeData,
    icon: <UserIcon />,
  });

  const toggleEditTransferAction = (id: string) => {
    push(`${baseRoute}/view-actions?equip_id=${id}`);
    setEditTransfer(!isEditTransfer);
  };

  const handleActionEditChangeClose = () => {
    push(`${baseRoute}/view-actions`);
    setEditTransfer(false);
  };

  const handleActionEditChange = () => {
    push(
      `${baseRoute}/view-actions?equip_id=${equipID}&action_edit_change={true}`,
    );
    setIsSelectReceiverOpen(true);
    setEditTransfer(false);
  };

  const handleSelectReceiverNext = () => {
    push(`${baseRoute}/view-actions?equip_id=${equipID}`);
  };

  const handleRemove = (id: string) => {
    dispatch(deleteOffboardingData(id));
  };

  const columns: any = useMemo(
    () =>
      ViewTransferActionsColumn((item: Record<string, string>) => (
        <ViewTransferActions
          onEdit={() => toggleEditTransferAction(item?.id as string)}
          onRemove={() => handleRemove(item?.id as string)}
        />
      )),
    [],
  );

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="p-2 border-b border-border-secondary flex flex-row items-center gap-3">
          <p className="text-gray-900 text-lg font-semibold">Actions</p>
          <Badge variant="blue">{data?.length || 0} Action(s)</Badge>
        </CardHeader>

        <PageState isLoading={false} isError={false}>
          <CardContent className="px-0 pt-0 pb-2">
            <>
              <DataTable
                data={data || []}
                columns={columns}
                // pagination={{
                //   currentPage: 1,
                //   lastPage: 3,
                //   onPageChange: () => null,
                // }}
              />
              <TransferActionsEdit
                isOpen={isEditTransfer}
                onClose={handleActionEditChangeClose}
                handleChange={handleActionEditChange}
              />
              <SelectAReceiver
                baseRoute={routes.OFFBOARDING}
                equipID={equipID}
                isOpen={isSelectReceiverOpen}
                onClose={() => setIsSelectReceiverOpen(!isSelectReceiverOpen)}
                onNext={handleSelectReceiverNext}
                employeeDataOptions={employeeDataOptions}
                equipmentsData={equipmentsData}
                isLoading={equipment_isLoading}
                isError={equipment_isError}
                editInstance={true}
              />
            </>
          </CardContent>
        </PageState>
      </Card>
    </>
  );
};

export default ViewTransferActionsTable;
