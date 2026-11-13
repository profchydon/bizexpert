import { FC, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageState from "@/components/PageState";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import ViewStorageActions from "./tableActions";
import ViewStorageActionsColumn from "./tableColumn";
import { Offboard_asset } from "@/types/offboarding";
import { useAppDispatch } from "@/store";
import { deleteOffboardingData } from "@/store/slices/offboardingSlice";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSearchParams } from "next/navigation";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import SelectAReceieverDate from "@/components/AllEquipments/Drawers/SelectAReceieverDate";
import routes from "@/routes";
import StorageDuration from "@/components/AllEquipments/Drawers/StorageDuration";

interface Props {
  data: Offboard_asset[];
  baseRoute: string;
}
const ViewStorageActionTable: FC<Props> = ({ data, baseRoute }) => {
  const { push } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const equipID = searchParams.get("equip_id");
  // const actionEditStoreInstance = searchParams.get("action_edit_store");

  const [isStorageDurationOpen, setIsStorageDurationOpen] = useState(false);
  const [isSelectReceiverDateOpen, setIsSelectReceiverDateOpen] =
    useState(false);

  const handleRemove = (id: string) => {
    dispatch(deleteOffboardingData(id));
  };

  const handleStorageDurageNext = () => {
    // toggleSelectReceiverDate();
    setIsSelectReceiverDateOpen(true);
  };

  // const handleActionEditStore = (id: string) => {
  //   router.push(
  //     `${baseRoute}/view-actions?equip_id=${id}&action_edit_store={true}`,
  //   );
  //   // setIsSelectReceiverDateOpen(true);
  //   setIsStorageDurationOpen(true);
  // };

  const handleCollectDateClose = () => {
    setIsSelectReceiverDateOpen(false);
    push(`${baseRoute}/view-actions`);
  };

  const handleCollectDateNext = () => {
    push(`${baseRoute}/view-actions`);
  };

  const columns: any = useMemo(
    () =>
      ViewStorageActionsColumn((item: Record<string, string>) => (
        <ViewStorageActions
          // onEdit={() => handleActionEditStore(item?.id as string)}
          onRemove={() => handleRemove(item?.id as string)}
        />
      )),
    [isStorageDurationOpen, isSelectReceiverDateOpen],
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
              <StorageDuration
                isOpen={isStorageDurationOpen}
                onClose={() => setIsStorageDurationOpen(!isStorageDurationOpen)}
                onNext={handleStorageDurageNext}
                equipID={equipID}
                // isEditable={Boolean(actionEditStoreInstance)}
              />
              <SelectAReceieverDate
                baseRoute={routes.OFFBOARDING}
                equipID={equipID}
                isOpen={isSelectReceiverDateOpen}
                onClose={handleCollectDateClose}
                onNext={handleCollectDateNext}
                // isEditable={Boolean(actionEditStoreInstance)}
              />
            </>
          </CardContent>
        </PageState>
      </Card>
    </>
  );
};

export default ViewStorageActionTable;
