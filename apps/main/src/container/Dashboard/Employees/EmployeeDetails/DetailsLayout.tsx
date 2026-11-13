import React, { memo, useMemo, useState } from "react";
import OrdersSection from "./OrdersSection";
import EquipmentSection from "./EquipmentSection";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { IEmployees } from "@/types/employees";
import { UserIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import SelectEquipments from "./Drawers/SelectEquipments";
import useTransformEmployeeToValueLabel from "@/hooks/useTransformEmployeeToValueLabel";
import { IEquipment } from "@/types/equipments";
import { ActionType, Offboard_asset } from "@/types/offboarding";
import useOffboarding from "@/hooks/useOffboarding";
import {
  addOffboardingData,
  setOffboardingData,
} from "@/store/slices/offboardingSlice";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import SelectActions from "./Drawers/SelectActions";
import EditProfileSlideout from "./EditProfileSlideout";
import UnselectedItems from "./Drawers/UnselectedItems";
import ActionConfirmation from "./Drawers/ActionConfirmation";
import SelectAReceiver from "@/components/AllEquipments/Drawers/SelectAReceiver";
import SelectAReceieverDate from "@/components/AllEquipments/Drawers/SelectAReceieverDate";
import ActionsDrawer from "@/components/AllEquipments/Drawers/Actions";
import TransferActionsEdit from "@/components/AllEquipments/Drawers/TransferActionsEdit";
import { resolveSelectEquipmentNextStep } from "./offboardSteps";
import { useOffboardConfirm } from "../EmployeesTable/useOffboardConfirm";
import EmployeeProfileRail from "./EmployeeProfileRail";
import OtherDetailsSlideout from "./OtherDetailsSlideout";
import { useEmployeeEquipmentDisposition } from "./useEmployeeEquipmentDisposition";
import {
  employeeDetailLayoutClass,
  employeeDetailMainClass,
} from "./employeeDetailClasses";

interface Props {
  employeeData: IEmployees | undefined;
  isActionDrawerOpen: boolean;
  setIsActionDrawerOpen: (value: boolean) => void;
  baseRoute: string;
}
const DetailsLayout: React.FC<Props> = memo(
  ({ employeeData, isActionDrawerOpen, setIsActionDrawerOpen, baseRoute }) => {
    const dispatch = useAppDispatch();
    const { getUserDetails } = useAuthUserDetail();
    const companyId = useWorkspaceCompanyId();
    const companyAdmin = getUserDetails();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const equipID = searchParams.get("equip_id");
    const actionEditChangeInstance = searchParams.get("action_edit_change");
    const actionEditStoreInstance = searchParams.get("action_edit_store");
    const router = useRouter();
    const param = useParams();
    const employeeId = param?.employeeId as string;

    const [itemsToArchive, setItemsToArchive] = useState<Offboard_asset[]>([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isUnselectedItemsOpen, setIsUnselectedItemsOpen] = useState(false);
    const [showSelectActions, setShowSelectActions] = useState(false);
    const [actionType, setActionType] = useState<ActionType>();
    const [isSelectEquipmentOpen, setIsSelectEquipmentOpen] = useState(false);

    const [isEditTransfer, setEditTransfer] = useState<boolean>(false);

    const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
    const [isOtherDetailsOpen, setIsOtherDetailsOpen] = useState(false);

    const { startDisposition, getPendingDisposition } =
      useEmployeeEquipmentDisposition(employeeData);

    const { offboardOne, isPending: isOffboardPending } = useOffboardConfirm(
      [],
    );

    const offboardingData = useAppSelector(
      (state) => state.persistedReducers.offboarding,
    ) as Offboard_asset;

    const { data: getEmployees } = useGetEmployeesQuery(
      { companyId: companyId! },
      { skip: !companyId },
    );
    const allEmployees = useMemo(
      () => (getEmployees?.data?.data as IEmployees[]) || [],
      [getEmployees],
    );

    const { transformData } = useOffboarding();

    const [selectedEquipments, setSelectedEquipments] = useState<
      Offboard_asset[]
    >([]);

    const [isSelectReceiverOpen, setIsSelectReceiverOpen] = useState(false);
    const [isSelectReceiverDateOpen, setIsSelectReceiverDateOpen] =
      useState(false);

    const toggleActionDrawer = () => setIsActionDrawerOpen(!isActionDrawerOpen);

    const toggleSelectReceiverDate = () => {
      setIsSelectReceiverDateOpen(!isSelectReceiverDateOpen);
    };

    const handleSelectReceiverNext = () => {
      if (!Boolean(actionEditChangeInstance)) {
        toggleSelectReceiverDate();
      }
    };

    const multipleInstance = (item?: IEquipment) => {
      const transform =
        !item?.id && !item?.title
          ? (transformData(selectedEquipments as any) as Offboard_asset[])
          : [transformData(item) as Offboard_asset];

      if (!offboardingData) {
        dispatch(setOffboardingData(transform));
      } else if (Array.isArray(offboardingData)) {
        const updatedData = transform?.filter(
          (newItem) =>
            !offboardingData.some(
              (existingItem) => existingItem.id === newItem.id,
            ),
        );

        if (updatedData.length > 0) {
          dispatch(addOffboardingData(updatedData));
        }
      }
    };

    const toggleMultipleSelectReceiver = (item?: IEquipment) => {
      multipleInstance(item);
    };

    const toggleSelectReceiver = () => {
      setIsSelectReceiverOpen((prev) => !prev);
      toggleMultipleSelectReceiver();
    };

    const toggleStoreCollectionDate = () => {
      multipleInstance();
      setIsSelectReceiverDateOpen(true);
    };

    const employeeDataOptions = useTransformEmployeeToValueLabel({
      data: allEmployees,
      icon: <UserIcon />,
    });

    const equipmentsData = employeeData?.equipment;

    const handleClearSelection = () => {
      setSelectedEquipments([]);
    };

    const handleCollectDateClose = () => {
      if (!Boolean(actionEditStoreInstance)) {
        return (setIsSelectReceiverDateOpen(false), router.push(pathname));
      }
      setIsSelectReceiverDateOpen(false);
      router.push(pathname);
      toggleActionDrawer();
    };

    const handleCollectDateNext = () => {
      if (!Boolean(actionEditStoreInstance)) {
        router.push(pathname);
      }
      setIsActionDrawerOpen(true);
    };

    const handleActionClose = () => {
      router.push(pathname);
      setIsActionDrawerOpen(false);
    };

    const toggleEditTransferAction = () => {
      setEditTransfer(!isEditTransfer);
    };

    const handleActionEditStore = () => {
      setIsSelectReceiverDateOpen(true);
      toggleActionDrawer();
    };

    const handleActionEditChangeClose = () => {
      router.push(pathname);
      setEditTransfer(false);
    };

    const handleActionEditChange = () => {
      router.push(`${pathname}?equip_id=${equipID}&action_edit_change={true}`);
      setIsSelectReceiverOpen(true);
      setEditTransfer(false);
      toggleActionDrawer();
    };

    const handleActionNextStep = () => {
      if (
        (offboardingData as unknown as Offboard_asset[]).filter(
          (item) => item?.status?.toLowerCase() === "assigned",
        ).length !==
        employeeData?.equipment?.filter(
          (item) => item?.status.toLowerCase() === "assigned",
        ).length
      ) {
        setIsUnselectedItemsOpen(true);
      } else {
        router.push(
          `${baseRoute}/view-actions?isEmployeeOffboarding=true&employeeId=${employeeId}`,
        );
      }
    };

    const handleConfirmation = () => {
      const offboardEquipments = offboardingData as unknown as Offboard_asset[];
      const transformData = itemsToArchive.map((item) => ({
        ...item,
        actionType: "Archive",
      }));
      dispatch(
        addOffboardingData([
          ...offboardEquipments,
          ...transformData!,
        ] as Offboard_asset[]),
      );
      router.push(
        `${baseRoute}/view-actions?isEmployeeOffboarding=true&employeeId=${employeeId}`,
      );
    };

    const isSelfOffboarding = companyAdmin?.id === employeeId;

    const handleStartOffboard = () => {
      if (!employeeData) return;
      offboardOne(employeeData);
    };

    const showOffboardAction =
      Boolean(employeeData?.equipment?.length) &&
      employeeData?.status.toLowerCase() === "active";

    return (
      <>
        <div className={employeeDetailLayoutClass}>
          <EmployeeProfileRail
            employee={employeeData}
            isSelfOffboarding={isSelfOffboarding}
            isOffboardPending={isOffboardPending}
            showOffboardAction={showOffboardAction}
            onEditProfile={() => setIsEditEmployeeOpen(true)}
            onOffboard={handleStartOffboard}
            onOpenOtherDetails={() => setIsOtherDetailsOpen(true)}
          />
          <div className={employeeDetailMainClass}>
            <EquipmentSection
              equipmentsData={employeeData?.equipment || []}
              onBulkDisposition={startDisposition}
              pendingDisposition={getPendingDisposition(employeeId)}
            />
            <OrdersSection ordersData={employeeData?.orders || []} />
          </div>
        </div>

        <OtherDetailsSlideout
          isOpen={isOtherDetailsOpen}
          onClose={() => setIsOtherDetailsOpen(false)}
          employee={employeeData}
        />

        <>
          <EditProfileSlideout
            isOpen={isEditEmployeeOpen}
            onClose={() => setIsEditEmployeeOpen(false)}
            employeeId={employeeId}
          />

          <SelectActions
            isOpen={showSelectActions}
            onClose={() => setShowSelectActions(false)}
            handleSetActionType={(value) => setActionType(value)}
            actionType={actionType!}
            handleNext={() => {
              setIsSelectEquipmentOpen(true);
              setShowSelectActions(false);
            }}
          />

          <SelectEquipments
            isOpen={isSelectEquipmentOpen}
            onClose={() => {
              setIsSelectEquipmentOpen(false);
              setActionType(undefined);
            }}
            employeeData={employeeData}
            handleNext={() => {
              const nextStep = resolveSelectEquipmentNextStep(actionType);
              if (nextStep === "selectReceiver") {
                toggleSelectReceiver();
              } else if (nextStep === "selectDate") {
                toggleStoreCollectionDate();
              }
              setIsSelectEquipmentOpen(false);
            }}
            selectedEquipments={selectedEquipments}
            setSelectedEquipments={(value) => setSelectedEquipments(value)}
          />

          <SelectAReceiver
            equipID={equipID}
            isOpen={isSelectReceiverOpen}
            onClose={() => setIsSelectReceiverOpen(!isSelectReceiverOpen)}
            onNext={handleSelectReceiverNext}
            employeeDataOptions={employeeDataOptions}
            equipmentsData={equipmentsData}
            isLoading={false}
            isError={false}
            baseRoute={pathname}
            setSelectedRows={handleClearSelection}
            currentEmployee={employeeData}
          />

          <SelectAReceieverDate
            baseRoute={pathname}
            equipID={equipID}
            isOpen={isSelectReceiverDateOpen}
            onClose={handleCollectDateClose}
            onNext={handleCollectDateNext}
            isEditable={Boolean(actionEditStoreInstance)}
            selectedRows={selectedEquipments}
            setSelectedRows={handleClearSelection}
          />

          <ActionsDrawer
            baseRoute={pathname}
            isOpen={isActionDrawerOpen}
            onClose={() => handleActionClose()}
            onTransferEdit={toggleEditTransferAction}
            handleAddAction={() => setShowSelectActions(true)}
            onSaleEdit={handleActionEditStore}
            onStoreEdit={handleActionEditStore}
            transferRoute={(id) => `${pathname}?equip_id=${id}`}
            storeRoute={(id) =>
              `${pathname}?equip_id=${id}&action_edit_store={true}`
            }
            saleRoute={(id) =>
              `${pathname}?equip_id=${id}&action_edit_store={true}`
            }
            onContinue={() => handleActionNextStep()}
          />

          <UnselectedItems
            isOpen={isUnselectedItemsOpen}
            onClose={() => {
              setIsUnselectedItemsOpen(false);
              setItemsToArchive([]);
            }}
            employeeData={employeeData}
            handleOtherAction={() => {
              setShowSelectActions(true);
              setItemsToArchive([]);
            }}
            setItemsToArchive={(value) => setItemsToArchive(value)}
            itemsToArchive={itemsToArchive}
            handleContinue={() => setIsConfirmationOpen(true)}
          />

          <ActionConfirmation
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onContinue={handleConfirmation}
          />

          <TransferActionsEdit
            isOpen={isEditTransfer}
            onClose={handleActionEditChangeClose}
            handleChange={handleActionEditChange}
          />
        </>
      </>
    );
  },
);

export default DetailsLayout;
