"use client";

import { useGetSingleEquipmentQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getSingleEquipment";
import PageState from "@/components/PageState";
import { useAppDispatch, useAppSelector } from "@/store";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import EquipmentPageHeader from "./EquipmentPageHeader";
import EquipmentDetailsLayout from "./EquipmentDetailsLayout";
import { viewEquipmentPageClass } from "./viewEquipmentClasses";
import { IEquipment } from "@/types/equipments";
import { Offboard_asset } from "@/types/offboarding";
import { getActionStatusFlow } from "@/components/Offboarding/util";
import EditSingleEquipmentDrawer from "../Drawers/EditSingleEquipment";
import EquipmentOtherDetails from "../Drawers/AllEquipmentsDetail/EquipmentOtherDetails";
import EquipmentScoreModal from "@/components/SingleAssetModal/EquipmentScoreModal";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { IEmployees } from "@/types/employees";
import { UserIcon } from "lucide-react";
import useTransformEmployeeToValueLabel from "@/hooks/useTransformEmployeeToValueLabel";
import SelectAReceiver from "@/components/AllEquipments/Drawers/SelectAReceiver";
import CreateCatalog from "../../Catalogs/CreateCatalogs";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useDeviceRefreshMultipleInstance } from "@/components/DeviceRefresh/hooks";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import useCart from "@/hooks/useCart";
import { IRefreshDevice } from "@/types/refreshDevice";
import routes from "@/routes";
import RefreshDeviceModal from "@/components/DeviceRefresh/modals/RefreshDeviceModal";
import DisposeEquipmentModal from "@/components/DeviceRefresh/modals/DisposeEquipmentModal";
import StoreEquipmentModal from "@/components/DeviceRefresh/modals/StoreEquipmentModal";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  normalizeEquipmentItems,
  resolveDeviceRefreshCountry,
} from "@/components/DeviceRefresh/resolveDeviceRefreshCountry";

const ViewEquipment = () => {
  const router = useRouter();
  const param = useParams();
  const dispatch = useAppDispatch();
  const equipmentId = param?.equipmentId as string;
  const [allEquipment, setAllEquipment] = useState<IEquipment[] | null>(null);
  const [isSingleAssetEditOpen, setIsSingleAssetEditOpen] = useState(false);
  const [isSingleAssetDetailsOpen, setIsSingleAssetDetailsOpen] =
    useState(false);
  const [isImproveScoreOpen, setIsImproveScoreOpen] = useState(false);
  const [isAssignAssetOpen, setIsAssignAssetOpen] = useState(false);
  const [isCreateCatalogOpen, setIsCreateCatalogOpen] = useState(false);
  const [selectedRefreshDeviceFlow, setSelectedRefreshDeviceFlow] =
    useState("");
  const [selectedDisposeEquipmentFlow, setSelectedDisposeEquipmentFlow] =
    useState("");
  const [isRefreshDeviceOpen, setIsRefreshDeviceOpen] = useState(false);
  const [isDisposeEquipmentOpen, setIsDisposeEquipmentOpen] = useState(false);
  const [isStoreEquipmentOpen, setIsStoreEquipmentOpen] = useState(false);

  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();

  const { removeAllItemsFromCart } = useCart();

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const { data: getEmployees } = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );
  const employeeData = useMemo(
    () => (getEmployees?.data?.data as IEmployees[]) || [],
    [getEmployees],
  );

  const currentEmployee = useMemo(
    () =>
      allEquipment?.find((item) => item?.id === equipmentId)?.assignee || "",
    [allEquipment, equipmentId],
  );

  const employeeDataOptions = useTransformEmployeeToValueLabel({
    data: employeeData,
    icon: <UserIcon />,
  });

  useEffect(() => {
    const storedEquipment = sessionStorage.getItem("allEquipment");
    if (storedEquipment) {
      setAllEquipment(JSON.parse(storedEquipment) as IEquipment[]);
    }
  }, []);

  useEffect(() => {
    const checkActionStatus = getActionStatusFlow(
      offboardingData,
      equipmentId as string,
    );
    if (checkActionStatus && checkActionStatus === "Completed") {
      router.push("/dashboard/all-equipments");
    }
  }, []);

  const {
    data: getSingleEquipment,
    isLoading,
    isError,
  } = useGetSingleEquipmentQuery(
    { companyId: companyId!, equipmentId: equipmentId! },
    { skip: !companyId || !equipmentId },
  );

  const singleEquipment = getSingleEquipment?.data as IEquipment;

  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;

  const { handleDeviceRefresh } = useDeviceRefreshMultipleInstance();

  const findCountry = (name: string) => {
    return countries?.find((country: any) => country.name === name);
  };

  const handleEquipmentEdit = () => {
    if (!isSingleAssetEditOpen) {
      return setIsSingleAssetEditOpen(true);
    }
    return setIsSingleAssetEditOpen(false);
  };

  const handleAssignEquipment = () => {
    if (!isAssignAssetOpen) {
      return setIsAssignAssetOpen(true);
    }
    return setIsAssignAssetOpen(false);
  };

  const handleEquipmentDetail = () => {
    if (!isSingleAssetDetailsOpen) {
      return setIsSingleAssetDetailsOpen(true);
    }
    return setIsSingleAssetDetailsOpen(false);
  };

  const handleImproveScore = () => {
    if (!isImproveScoreOpen) {
      return setIsImproveScoreOpen(true);
    }
    return setIsImproveScoreOpen(false);
  };

  const handleCreateCatalog = () => {
    if (!isCreateCatalogOpen) {
      return setIsCreateCatalogOpen(true);
    }
    return setIsCreateCatalogOpen(false);
  };

  const storeCountryData = (
    country: ReturnType<typeof resolveDeviceRefreshCountry>,
  ) => {
    dispatch(setCountry(country));
    dispatch(setSelectedEmployees([]));
    removeAllItemsFromCart();
  };

  const storeRefreshStorageData = (
    item: IRefreshDevice,
    actionType: string,
  ) => {
    handleDeviceRefresh(item, actionType);
  };

  const decideRefreshDeviceFlow = (item?: IEquipment) => {
    const selectItemInstance: Record<string, () => void> = {
      "Dispose equipment": () => setIsDisposeEquipmentOpen(true),
      "Store equipment": () => setIsStoreEquipmentOpen(true),
    };

    selectItemInstance?.[selectedRefreshDeviceFlow]?.();
    setIsRefreshDeviceOpen(false);
  };

  const decideDisposeEquipmentFlow = (item: IEquipment, actionType: string) => {
    const items = normalizeEquipmentItems(item);
    const resolvedCountry = resolveDeviceRefreshCountry(
      items,
      undefined,
      undefined,
      countries,
    );
    const selectItemInstance: Record<string, () => void> = {
      "Buy equipment": () => {
        storeCountryData(resolvedCountry);
        storeRefreshStorageData(item as any, actionType);
        router.push(
          `${routes?.EQUIP_EMPLOYEE_MARKETPLACE}?device-refresh=true&single-instance=true`,
        );
      },
      "From storage": () => {
        storeRefreshStorageData(item as any, actionType);
        router.push(
          `${routes?.STORAGE}/${resolvedCountry.id}?device-refresh=true&single-instance=true`,
        );
      },
    };

    selectItemInstance?.[selectedDisposeEquipmentFlow]?.();
    setIsDisposeEquipmentOpen(false);
  };

  return (
    <div className={viewEquipmentPageClass}>
      <EquipmentPageHeader allEquipment={allEquipment as IEquipment[]} />

      <PageState isLoading={isLoading} isError={isError}>
        <EquipmentDetailsLayout
          equipmentData={singleEquipment}
          allEquipment={allEquipment as IEquipment[]}
          onEdit={handleEquipmentEdit}
          onViewDetails={handleEquipmentDetail}
          onImproveScore={handleImproveScore}
          currentEmployee={currentEmployee}
          employeeDataOptions={employeeDataOptions}
          onCorrect={() => setIsRefreshDeviceOpen(true)}
        />

        <EditSingleEquipmentDrawer
          isOpen={isSingleAssetEditOpen}
          onClose={handleEquipmentEdit}
          equipmentDetailsInstance={true}
          removeSubmitRoute={true}
        />

        <EquipmentOtherDetails
          isOpen={isSingleAssetDetailsOpen}
          onClose={handleEquipmentDetail}
          equipment={singleEquipment}
        />

        <EquipmentScoreModal
          isOpen={isImproveScoreOpen}
          onClose={handleImproveScore}
          missing_information={
            singleEquipment?.missing_information
              ? (singleEquipment?.missing_information as unknown as string[])
              : ([] as string[])
          }
          equipmentStatus={singleEquipment?.status}
          handleEquipmentEdit={handleEquipmentEdit}
          handleAssignEquipment={handleAssignEquipment}
          handleCreateCatalog={handleCreateCatalog}
          handleRefreshEquipment={() => setIsRefreshDeviceOpen(true)}
        />

        <SelectAReceiver
          baseRoute={""}
          isReAssignInstance={true}
          equipID={equipmentId}
          isOpen={isAssignAssetOpen}
          onClose={() => setIsAssignAssetOpen(!isAssignAssetOpen)}
          onNext={() => {}}
          employeeDataOptions={employeeDataOptions}
          equipmentsData={allEquipment as IEquipment[]}
          currentEmployee={currentEmployee as any}
        />

        <CreateCatalog
          isOpen={isCreateCatalogOpen}
          onClose={handleCreateCatalog}
        />

        <RefreshDeviceModal
          isOpen={isRefreshDeviceOpen}
          onClose={() => setIsRefreshDeviceOpen(!isRefreshDeviceOpen)}
          selectedStep={selectedRefreshDeviceFlow}
          setSelectedStep={setSelectedRefreshDeviceFlow}
          handleContinue={() => decideRefreshDeviceFlow(singleEquipment)}
        />

        <DisposeEquipmentModal
          isOpen={isDisposeEquipmentOpen}
          onClose={() => setIsDisposeEquipmentOpen(!isDisposeEquipmentOpen)}
          selectedStep={selectedDisposeEquipmentFlow}
          setSelectedStep={setSelectedDisposeEquipmentFlow}
          handleContinue={() =>
            decideDisposeEquipmentFlow(singleEquipment, "Dispose")
          }
        />
        <StoreEquipmentModal
          isOpen={isStoreEquipmentOpen}
          onClose={() => setIsStoreEquipmentOpen(!isStoreEquipmentOpen)}
          selectedStep={selectedDisposeEquipmentFlow}
          setSelectedStep={setSelectedDisposeEquipmentFlow}
          handleContinue={() =>
            decideDisposeEquipmentFlow(singleEquipment, "Store")
          }
        />
      </PageState>
    </div>
  );
};

export default ViewEquipment;
