import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import EquipmentEmptyTable from "../EquipmentEmptyTable";
import { equipmentTableShellClass } from "../equipmentTableClasses";
import { mapEquipmentListRows } from "../mapEquipmentListRows";
import { currentQueryList } from "@/utils/currentQueryList";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import PageState from "@/components/PageState";
import { usePathname, useSearchParams } from "next/navigation";
import { useResetPageWhenValueChanges } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { withListLocation } from "@/utils/tableListPage";
import { useDebounce } from "use-debounce";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import AllEquipmentsTableColumn from "./tableColumn";
import AllEquipmentsTableActions from "./tableAction";
import TableHeader from "./tableHeader";
import FilterOffboardingEquipments from "../Drawers/FilterAllEquipments";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  normalizeEquipmentFilterValues,
  type EquipmentFilterValues,
} from "../Drawers/FilterAllEquipments/equipmentFilterOptions";
import { buildEquipmentTableQueryFilters } from "../Drawers/FilterAllEquipments/equipmentFilterQuery";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import useTransformEmployeeToValueLabel from "@/hooks/useTransformEmployeeToValueLabel";
import {
  MultiSelectValue,
  SingleSelectValue,
} from "@/components/ui/autocomplete";
import StorageDuration from "../Drawers/StorageDuration";
import SalesPrice from "../Drawers/SalesPrice";
import SelectAReceiver from "../Drawers/SelectAReceiver";
import { UserIcon } from "lucide-react";
import { IEquipment } from "@/types/equipments";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addOffboardingData,
  resetOffboardingData,
  setOffboardingData,
} from "@/store/slices/offboardingSlice";
import { Offboard_asset } from "@/types/offboarding";
import SelectAReceieverDate from "../Drawers/SelectAReceieverDate";
import ActionsDrawer from "../Drawers/Actions";
import { IEmployees } from "@/types/employees";
import useOffboarding from "@/hooks/useOffboarding";
import TransferActionsEdit from "../Drawers/TransferActionsEdit";
import ReassignSelectEquipmentModal from "@/components/SingleAssetModal/ReassignSelectEquipment";
import { useAllEquipmentsReassignFlow } from "./useAllEquipmentsReassignFlow";
import { startEquipmentOffboardReassign } from "../startEquipmentOffboardReassign";
import { startEquipmentOffboardStore } from "../startEquipmentOffboardStore";
import routes from "@/routes";
import EquipmentsDetailItem from "@/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail";
import EditSingleEquipmentDrawer from "@/container/Dashboard/AllEquipments/Drawers/EditSingleEquipment";
import ExportEquipmentCsvData from "../Drawers/ExportEquipmentCsvData";
import config from "@/config/config";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { isQueryResultPending } from "@/utils/isQueryResultPending";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import DisposeEquipmentModal from "@/components/DeviceRefresh/modals/DisposeEquipmentModal";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import useCart from "@/hooks/useCart";
import { useDeviceRefreshMultipleInstance } from "@/components/DeviceRefresh/hooks";
import StoreEquipmentModal from "@/components/DeviceRefresh/modals/StoreEquipmentModal";
import { canPerformAction } from "../util";
import {
  resolveEquipmentListStatus,
  toApiEquipmentStatus,
} from "../equipmentListStatus";
import { EntityFilterBanner } from "@/container/Dashboard/Accounts/components/EntityFilterBanner";
import { resolveSubsidiaryName } from "@/container/Dashboard/Accounts/utils/subsidiaryNameById";
import { useVisibleSubsidiaries } from "@/container/Dashboard/Accounts/hooks/useAccountsData";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import {
  normalizeEquipmentItems,
  resolveDeviceRefreshCountry,
  ResolvedDeviceRefreshCountry,
} from "@/components/DeviceRefresh/resolveDeviceRefreshCountry";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

interface Props {
  isActionDrawerOpen: boolean;
  setIsActionDrawerOpen: (value: boolean) => void;
  isExportDrawerOpen?: boolean;
  setIsExportDrawerOpen?: (value: boolean) => void;
  archived?: boolean;
  baseRoute: string;
  getAssignedEquipments?: boolean;
  removeFilterButton?: boolean;
  refresh_status?: boolean;
  assignee_country?: string;
  assigned_country?: string;
  country_name?: string;
}
const AllEquipmentsTable: FC<Props> = ({
  isActionDrawerOpen,
  setIsActionDrawerOpen,
  isExportDrawerOpen,
  setIsExportDrawerOpen,
  archived,
  baseRoute,
  getAssignedEquipments,
  removeFilterButton,
  refresh_status,
  assignee_country,
  assigned_country,
  country_name,
}) => {
  const { push, replace } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const equipID = searchParams.get("equip_id");
  const actionEditChangeInstance = searchParams.get("action_edit_change");
  const actionEditStoreInstance = searchParams.get("action_edit_store");
  const equipmentId = searchParams.get("view_equipment_id");
  const edit_equipment_id = searchParams.get("edit_equipment_id");
  const countryId = assigned_country || (searchParams.get("ci") as string);
  const countryName = country_name || (searchParams.get("cn") as string);
  const isDeviceRefreshEquipment = searchParams.get("isEquipment");
  const isDeviceRefresh = searchParams.get("device-refresh");
  const isDeviceRefreshSingleInstance = searchParams.get("single-instance");
  const { activeEntityId: entityId } = useActiveWorkspace();
  const subsidiaries = useVisibleSubsidiaries();

  // dispatch(resetEquipEmployeeState())

  const [isExportLoading, setIsExportLoading] = useState(false);
  const [isApplyFilter, setIsApplyFilter] = useState(false);
  const [isFilterRefetching, setIsFilterRefetching] = useState(false);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<
    string[] | undefined
  >([]);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<
    string[] | undefined
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string[] | undefined>(
    [],
  );
  const [dateRange, setDateRange] = useState<{ to: string; from: string }>();
  const [selectedStorage, setSelectedStorage] = useState<
    MultiSelectValue | undefined | null
  >([]);
  const [selectedRam, setSelectedRam] = useState<
    MultiSelectValue | undefined | null
  >([]);
  const [selectedCountries, setSelectedCountries] = useState<
    MultiSelectValue | undefined | null
  >();

  const [isDisposeEquipmentOpen, setIsDisposeEquipmentOpen] = useState(false);
  const [selectedDisposeEquipmentFlow, setSelectedDisposeEquipmentFlow] =
    useState("");
  const [isStoreEquipmentOpen, setIsStoreEquipmentOpen] = useState(false);
  const [disposeTargetItems, setDisposeTargetItems] = useState<IEquipment[]>(
    [],
  );

  const clearFilters = () => {
    setSelectedAssetTypes([]);
    setSelectedStatus([]);
    setSelectedPurchaseType([]);
    setSelectedStorage(null);
    setSelectedRam(null);
    setSelectedCountries(null);
    setDateRange(undefined);
  };

  const applyExportFilter = () => {
    const type = selectedAssetTypes?.join(",") ?? undefined;
    const source = selectedPurchaseType?.join(",") ?? undefined;
    const status =
      selectedStatus?.map(toApiEquipmentStatus)?.join(",") ?? undefined;
    const from = dateRange?.from;
    const to = dateRange?.to;
    const country =
      selectedCountries?.map((value) => value.label)?.join(",") ?? undefined;

    const filters = {
      type,
      status,
      country,
      source,
      from,
      to,
    };

    return filters;
  };

  useEffect(() => {
    if (countryName && countryId) {
      const defaultCountry = [
        {
          label: countryName,
          value: countryId,
        },
      ] as MultiSelectValue;
      setSelectedCountries(defaultCountry);
      setIsApplyFilter(true);
    }
  }, [countryName, countryId]);

  const applyFilter = () => {
    if (!isApplyFilter) return undefined;

    return buildEquipmentTableQueryFilters(
      normalizeEquipmentFilterValues({
        selectedAssetTypes,
        selectedStatus,
        selectedStorage: selectedStorage ?? [],
        selectedRam: selectedRam ?? [],
        selectedCountries: selectedCountries ?? [],
      }),
      {
        source: selectedPurchaseType?.join(",") || undefined,
        from: dateRange?.from,
        to: dateRange?.to,
      },
    );
  };

  const { page, setPage } = useTablePageQuery();
  const [isStorageDurationOpen, setIsStorageDurationOpen] = useState(false);
  const [isSalesPriceOpen, setIsSalesPriceOpen] = useState(false);

  const [search, setSearch] = useState<string | null>(null);
  const [searchValue] = useDebounce(search, 2000);

  useResetPageWhenValueChanges(setPage, entityId);

  const [selectedEmployeeValue, setSelectedEmployeeValue] =
    useState<SingleSelectValue | null>(null);
  const [
    selectedEquipmentTableFilterValue,
    setSelectedEquipmentTableFilterValue,
  ] = useState("all");
  const [isFilterEquipmentsOpen, setIsFilterEquipmentsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
  const [isSelectReceiverDateOpen, setIsSelectReceiverDateOpen] =
    useState(false);

  const [isEditTransfer, setEditTransfer] = useState<boolean>(false);
  const [isSelectReceiverOpen, setIsSelectReceiverOpen] = useState(false);
  const [isSystemReassginOpen, setIsSystemReassginOpen] = useState(false);
  const [reassignEquipId, setReassignEquipId] = useState<string | null>(null);
  const systemReassignEquipId = reassignEquipId ?? equipID;

  const [selectedExternalRows, setSelectedExternalRows] = useState<
    Record<string, boolean>
  >({});
  const { removeAllItemsFromCart } = useCart();

  const handleClearSelection = () => {
    setSelectedExternalRows({});
    setSelectedRows([]);
  };

  const { getAuthToken } = useAuthUserDetail();
  const userToken = getAuthToken();
  const companyId = useWorkspaceCompanyId();
  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const onExportData = async () => {
    setIsExportLoading(true);
    const params = applyExportFilter();

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "" && value !== undefined,
      ),
    );

    const queryString = new URLSearchParams(filteredParams as any).toString();
    const handeQueryString = () => {
      if (queryString) {
        return `${config.API_URL}/companies/${companyId}/equipments/?${queryString}&download=true`;
      } else {
        return `${config.API_URL}/companies/${companyId}/equipments/?download=true`;
      }
    };

    try {
      const response = await fetch(`${handeQueryString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "text/csv",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        setIsExportLoading(false);
        displayErrorMessage("Unable to generate CSV for specified filters.");
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Rayda_Equipment_Filter.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      setIsExportDrawerOpen?.(false);
      setIsExportLoading(false);
      clearFilters();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const appliedFilter = applyFilter();

  const {
    currentData: currentEquipments,
    isLoading: equipment_isLoading,
    isFetching: equipment_isFetching,
    isError: equipment_isError,
    isUninitialized: equipment_isUninitialized,
  } = useGetEquipmentsQuery(
    {
      companyId: companyId!,
      params: {
        assigned: getAssignedEquipments ? getAssignedEquipments : undefined,
        search: searchValue || selectedEmployeeValue?.value || null,
        ...appliedFilter,
        status: resolveEquipmentListStatus(archived, appliedFilter?.status),
        source:
          selectedEquipmentTableFilterValue === "all"
            ? (appliedFilter?.source ?? null)
            : selectedEquipmentTableFilterValue === "Rayda"
              ? "Rayda"
              : selectedEquipmentTableFilterValue,
        refresh_status: refresh_status || undefined,
        assignee_country: assignee_country || undefined,
        page,
      },
    },
    { skip: !companyId, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (!equipment_isFetching) {
      setIsFilterRefetching(false);
    }
  }, [equipment_isFetching, isFilterRefetching]);

  const equipmentsData = useMemo(
    () => mapEquipmentListRows(currentQueryList<IEquipment>(currentEquipments)),
    [currentEquipments],
  );

  const tableIsPending =
    isFilterRefetching ||
    isQueryResultPending({
      isUninitialized: equipment_isUninitialized,
      isLoading: equipment_isLoading,
      isFetching: equipment_isFetching,
      hasRows: equipmentsData.length > 0,
    });

  const showEquipmentEmpty = !tableIsPending && equipmentsData.length === 0;

  const currentPage = currentEquipments?.data?.current_page ?? 1;
  const lastPage = currentEquipments?.data?.last_page ?? 1;
  const employeeDataCount = currentEquipments?.data?.total ?? 0;

  const { data: getEmployees } = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );
  const employeeData = useMemo(
    () => (getEmployees?.data?.data as IEmployees[]) || [],
    [getEmployees],
  );

  const currentEmployee = useMemo(
    () => equipmentsData?.find((item) => item?.id === equipID)?.assignee || "",
    [equipmentsData, equipID],
  );

  const employeeDataOptions = useTransformEmployeeToValueLabel({
    data: employeeData,
    icon: <UserIcon />,
  });

  const { transformData } = useOffboarding();
  const { handleDeviceRefresh } = useDeviceRefreshMultipleInstance();
  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;

  const multipleInstance = (item?: IEquipment) => {
    const transform =
      !item?.id && !item?.title
        ? (transformData(selectedRows as any) as Offboard_asset[])
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

  const toggleSelectReceiver = (item?: IEquipment) => {
    if (selectedRows?.length > 0) {
      return (
        setIsSelectReceiverOpen((prev) => !prev),
        toggleMultipleSelectReceiver()
      );
    }

    if (item && Array.isArray(offboardingData)) {
      return (
        setIsSelectReceiverOpen((prev) => !prev),
        toggleMultipleSelectReceiver(item),
        push(`${baseRoute}?equip_id=${item?.id}`)
      );
    }

    setIsSelectReceiverOpen((prev) => !prev);
    push(`${baseRoute}?equip_id=${item?.id}`);
  };

  const startOffboardReassign = useCallback(
    (item?: IEquipment) => {
      startEquipmentOffboardReassign({
        item,
        selectedRows: selectedRows as IEquipment[],
        employees: employeeData,
        dispatch,
        push,
        onStarted: handleClearSelection,
      });
    },
    [dispatch, employeeData, handleClearSelection, push, selectedRows],
  );

  const startOffboardStore = useCallback(
    (item?: IEquipment) => {
      startEquipmentOffboardStore({
        item,
        selectedRows: selectedRows as IEquipment[],
        employees: employeeData,
        dispatch,
        push,
        onStarted: handleClearSelection,
      });
    },
    [dispatch, employeeData, handleClearSelection, push, selectedRows],
  );

  const {
    isSelectReceiverFlowTypeOpen,
    selectedReceiverFlow,
    setSelectedReceiverFlow,
    openReassignTypeModal,
    closeReassignTypeModal,
    continueReassignType,
  } = useAllEquipmentsReassignFlow({
    baseRoute,
    push,
    selectedRows: selectedRows as IEquipment[],
    openSystemReassign: (equipId) => {
      setReassignEquipId(equipId);
      setIsSystemReassginOpen(true);
    },
    startOffboardReassign,
    seedOffboardingSelection: toggleMultipleSelectReceiver,
  });

  const toggleSelectReceiverDate = () => {
    setIsSelectReceiverDateOpen(!isSelectReceiverDateOpen);
  };

  const toggleMultipleStorageDuration = (item?: IEquipment) => {
    multipleInstance(item);
  };

  const toggleMultipleSalesPrice = (item?: IEquipment) => {
    multipleInstance(item);
  };

  const toggleFilterEquipments = () => {
    setIsFilterEquipmentsOpen(!isFilterEquipmentsOpen);
  };
  const toggleExportEquipments = () =>
    setIsExportDrawerOpen?.(!isExportDrawerOpen);

  const toggleSalesPrice = (item?: IEquipment) => {
    if (selectedRows?.length > 0) {
      return (setIsSalesPriceOpen((prev) => !prev), toggleMultipleSalesPrice());
    }

    if (item && Array.isArray(offboardingData)) {
      return (
        setIsSalesPriceOpen((prev) => !prev),
        toggleMultipleSalesPrice(item),
        push(`${baseRoute}?equip_id=${item?.id}`)
      );
    }

    setIsSalesPriceOpen(!isSalesPriceOpen);
    push(`${baseRoute}?equip_id=${item?.id}`);
  };

  const openEquipmentsDetailItem = (equipment_id: string) => {
    push(`${baseRoute}?view_equipment_id=${equipment_id}`);
  };

  const openEditEquipments = (equipment_id: string) => {
    push(`${baseRoute}?edit_equipment_id=${equipment_id}`);
  };

  const toggleActionDrawer = () => setIsActionDrawerOpen(!isActionDrawerOpen);

  const prepareViewEquipment = (equipment: IEquipment[], id: string) => {
    dispatch(resetOffboardingData());
    sessionStorage.setItem("allEquipment", JSON.stringify(equipment));
  };

  const handleViewEquipment = (equipment: IEquipment[], id: string) => {
    prepareViewEquipment(equipment, id);
    push(`/dashboard/all-equipments/${id}`);
  };

  const storeRefreshStorageData = (
    item: IEquipment | IEquipment[],
    actionType: string,
  ) => {
    handleDeviceRefresh(item, actionType);
  };

  const storeCountryData = (country: ResolvedDeviceRefreshCountry) => {
    dispatch(setCountry(country));
    dispatch(setSelectedEmployees([]));
    removeAllItemsFromCart();
  };

  const decideDisposeEquipmentFlow = (
    item: IEquipment | IEquipment[],
    actionType: string,
  ) => {
    const items = normalizeEquipmentItems(item);
    const resolvedCountry = resolveDeviceRefreshCountry(
      items,
      countryId,
      countryName,
      countries,
    );

    const marketplaceHref = isDeviceRefreshSingleInstance
      ? `${routes.EQUIP_EMPLOYEE_MARKETPLACE}?device-refresh=true&single-instance=true`
      : `${routes.EQUIP_EMPLOYEE_MARKETPLACE}?device-refresh=true`;

    const storageHref = isDeviceRefreshSingleInstance
      ? `${routes.STORAGE}/${resolvedCountry.id}?device-refresh=true&single-instance=true`
      : `${routes.STORAGE}/${resolvedCountry.id}?device-refresh=true`;

    const selectItemInstance: Record<string, () => void> = {
      "Buy equipment": () => {
        storeCountryData(resolvedCountry);
        storeRefreshStorageData(items, actionType);
        push(marketplaceHref);
      },
      "From storage": () => {
        storeRefreshStorageData(items, actionType);
        push(storageHref);
      },
    };

    selectItemInstance?.[selectedDisposeEquipmentFlow]?.();
    setIsDisposeEquipmentOpen(false);
    setIsStoreEquipmentOpen(false);
    setDisposeTargetItems([]);
  };

  // Assuming you have your `rows` or `equipmentsData` available here
  const firstActionableItemId = useMemo(() => {
    let foundId: string | null = null;

    equipmentsData?.some((item) => {
      const hasAnyAction =
        (!isDeviceRefreshEquipment &&
          !isDeviceRefresh &&
          (pathname === routes.All_Equipments ||
            canPerformAction(item.status!, "transfer") ||
            canPerformAction(item.status!, "store"))) ||
        (isDeviceRefreshEquipment &&
          isDeviceRefresh &&
          (canPerformAction(item.status!, "dispose") ||
            canPerformAction(item.status!, "store")));

      if (hasAnyAction && !foundId) {
        foundId = item.id as string;
        return true; // break loop
      }
      return false;
    });

    return foundId;
  }, [equipmentsData, isDeviceRefreshEquipment, isDeviceRefresh, pathname]);

  const renderActions = useCallback(
    (item: Record<string, string>) => {
      return (
        <AllEquipmentsTableActions
          item={{
            id: item?.id,
            assignee: item?.assignee,
            status: item?.status,
            country: item?.country,
          }}
          firstActionableItemId={firstActionableItemId}
          onTransferEquipment={() => {
            if (item?.country) {
              if (item?.status?.toLowerCase() === "unassigned") {
                setReassignEquipId(item.id);
                setIsSystemReassginOpen(true);
                push(`${baseRoute}?equip_id=${item?.id}`);
                return;
              }

              if (item?.status?.toLowerCase() === "assigned") {
                return openReassignTypeModal(item as unknown as IEquipment);
              }
            } else {
              displayErrorMessage("Equipment doesnt have an assigned country");
            }
          }}
          onStoreEquipment={() => {
            if (item.country) {
              startOffboardStore(item as unknown as IEquipment);
            } else {
              displayErrorMessage("Equipment doesnt have an assigned country");
            }
          }}
          onSellEquipment={() => {
            if (item.country) {
              toggleSalesPrice(item as any);
            } else {
              displayErrorMessage("Equipment doesnt have an assigned country");
            }
          }}
          viewHref={withListLocation(`/dashboard/all-equipments/${item?.id}`, {
            page,
          })}
          onBeforeViewNavigate={() =>
            prepareViewEquipment(equipmentsData, item?.id as string)
          }
          onEdit={() => openEditEquipments(item?.id)}
          offboardingData={offboardingData as unknown as any}
          onDispose={() => {
            setDisposeTargetItems([item as unknown as IEquipment]);
            setIsDisposeEquipmentOpen(true);
            storeRefreshStorageData([item] as any, "Dispose");
          }}
          onRefreshStore={() => {
            setDisposeTargetItems([item as unknown as IEquipment]);
            setIsStoreEquipmentOpen(true);
            storeRefreshStorageData([item] as any, "Store");
          }}
          isDeviceRefreshEquipment={Boolean(isDeviceRefreshEquipment)}
          isDeviceRefresh={Boolean(isDeviceRefresh)}
        />
      );
    },
    [
      push,
      toggleSelectReceiver,
      openReassignTypeModal,
      startOffboardStore,
      offboardingData,
      setIsDisposeEquipmentOpen,
      setIsStoreEquipmentOpen,
      firstActionableItemId,
      page,
    ],
  );

  const columns: any = useMemo(
    () => AllEquipmentsTableColumn(renderActions),
    [renderActions],
  );

  const handleEquipmentTableFilterValueChange = (value: string) => {
    setSelectedEquipmentTableFilterValue(value);
  };

  const handleReset = () => {
    setSearch(null);
    setSelectedEmployeeValue(null);
    clearFilters();
    setIsApplyFilter(false);
    setIsFilterRefetching(false);
    setPage(1);
  };

  const applyEquipmentFilters = (next: EquipmentFilterValues) => {
    const normalized = normalizeEquipmentFilterValues(next);
    const hasFilter =
      normalized.selectedAssetTypes.length > 0 ||
      normalized.selectedStatus.length > 0 ||
      normalized.selectedStorage.length > 0 ||
      normalized.selectedRam.length > 0 ||
      normalized.selectedCountries.length > 0;
    setSelectedAssetTypes(normalized.selectedAssetTypes);
    setSelectedStatus(normalized.selectedStatus);
    setSelectedStorage(normalized.selectedStorage);
    setSelectedRam(normalized.selectedRam);
    setSelectedCountries(normalized.selectedCountries);
    setIsApplyFilter(hasFilter);
    setIsFilterRefetching(true);
    setPage(1);
    setIsFilterEquipmentsOpen(false);
  };

  const handleSelectReceiverNext = () => {
    if (!Boolean(actionEditChangeInstance)) {
      return toggleSelectReceiverDate();
    }
    push(`${baseRoute}?equip_id=${equipID}`);
    toggleActionDrawer();
  };

  const handleCollectDateNext = () => {
    if (!Boolean(actionEditStoreInstance)) {
      push(baseRoute);
      setIsActionDrawerOpen(true);
      return;
    }
    push(`${baseRoute}?equip_id=${equipID}`);
    toggleActionDrawer();
  };

  const handleCollectDateClose = () => {
    if (!Boolean(actionEditStoreInstance)) {
      return (setIsSelectReceiverDateOpen(false), push(baseRoute));
    }
    setIsSelectReceiverDateOpen(false);
    push(baseRoute);
    toggleActionDrawer();
  };

  const handleStorageDurageNext = () => {
    toggleSelectReceiverDate();
  };

  const handleSalesPriceNext = () => {
    push(`${baseRoute}?equip_id=${equipID}`);
    toggleSelectReceiverDate();
  };

  const toggleEditTransferAction = () => {
    setEditTransfer(!isEditTransfer);
  };

  const handleActionEditChange = () => {
    push(`${baseRoute}?equip_id=${equipID}&action_edit_change={true}`);
    setIsSelectReceiverOpen(true);
    setEditTransfer(false);
    toggleActionDrawer();
  };
  const handleActionEditChangeClose = () => {
    push(baseRoute);
    setEditTransfer(false);
  };

  const handleActionClose = () => {
    push(baseRoute);
    setIsActionDrawerOpen(false);
  };

  const handleActionEditStore = () => {
    // setIsStorageDurationOpen(true);
    setIsSelectReceiverDateOpen(true);
    toggleActionDrawer();
  };

  const handleActionEditSale = () => {
    setIsSelectReceiverDateOpen(true);
    toggleActionDrawer();
  };

  const handleEquipmentDetailClose = () => {
    replace(routes.All_Equipments);
  };

  return (
    <>
      {entityId && (
        <EntityFilterBanner
          entityName={
            resolveSubsidiaryName(entityId, subsidiaries) ?? "this entity"
          }
          count={employeeDataCount}
          noun="asset"
          clearHref={routes.All_Equipments}
        />
      )}
      <div className={equipmentTableShellClass}>
        <TableHeader
          removeFilterButton={removeFilterButton}
          selectedValue={selectedEquipmentTableFilterValue}
          onHandleChange={handleEquipmentTableFilterValueChange}
          searchValue={search}
          setSearch={setSearch}
          equipmentsLength={employeeDataCount || 0}
          toggleFilterEquipments={toggleFilterEquipments}
          employeeDataOptions={employeeDataOptions}
          selectedOption={selectedEmployeeValue}
          setSelectedEmployeeValue={setSelectedEmployeeValue}
          selectedRows={selectedRows}
          onReset={handleReset}
          multipleSelectBtnActions={{
            onTransfer: () => openReassignTypeModal(),
            onStore: () => startOffboardStore(),
            onSell: toggleSalesPrice,
            onDispose: () => {
              if (selectedRows?.length < 2) {
                setDisposeTargetItems(selectedRows as IEquipment[]);
                setIsDisposeEquipmentOpen(true);
                storeRefreshStorageData(selectedRows as any, "Dispose");
                return;
              }
              setDisposeTargetItems(selectedRows as IEquipment[]);
              setIsDisposeEquipmentOpen(true);
            },
            onRefreshStore: () => {
              if (selectedRows?.length < 2) {
                setDisposeTargetItems(selectedRows as IEquipment[]);
                setIsStoreEquipmentOpen(true);
                storeRefreshStorageData(selectedRows as any, "Store");
                return;
              }
              setDisposeTargetItems(selectedRows as IEquipment[]);
              setIsStoreEquipmentOpen(true);
            },
          }}
          isDeviceRefreshEquipment={Boolean(isDeviceRefreshEquipment)}
          isDeviceRefresh={Boolean(isDeviceRefresh)}
        />
        <PageState isLoading={tableIsPending} isError={equipment_isError}>
          <DataTable
            data={equipmentsData}
            columns={columns}
            pagination={{
              currentPage,
              lastPage,
              onPageChange: (value) => setPage(value),
            }}
            externalRowSelection={selectedExternalRows}
            setSeletectedValue={setSelectedRows}
          >
            {showEquipmentEmpty ? <EquipmentEmptyTable /> : null}
          </DataTable>
        </PageState>
      </div>

      <FilterOffboardingEquipments
        isOpen={isFilterEquipmentsOpen}
        onClose={toggleFilterEquipments}
        isApplying={isFilterRefetching}
        values={{
          selectedAssetTypes: selectedAssetTypes ?? [],
          selectedStatus: selectedStatus ?? [],
          selectedStorage: selectedStorage ?? [],
          selectedRam: selectedRam ?? [],
          selectedCountries: selectedCountries ?? [],
        }}
        onApply={applyEquipmentFilters}
      />

      <ExportEquipmentCsvData
        isOpen={isExportDrawerOpen!}
        onClose={() => {
          setIsExportDrawerOpen?.(false);
        }}
        setSelectedAssetTypes={(value) => setSelectedAssetTypes(value)}
        selectedAssetTypes={selectedAssetTypes!}
        setSelectedStatus={(value) => setSelectedStatus(value)}
        selectedStatus={selectedStatus!}
        setSelectedPurchaseType={(value) => setSelectedPurchaseType(value)}
        selectedPurchaseType={selectedPurchaseType!}
        setSelectedCountries={(value) => setSelectedCountries(value)}
        selectedCountries={selectedCountries!}
        setDateRange={(value) => setDateRange(value!)}
        dateRange={dateRange!}
        onExportCSV={onExportData}
        isExportLoading={isExportLoading}
        onClearFilter={() => {
          clearFilters();
          setIsApplyFilter(false);
          setIsFilterRefetching(true);
          setPage(1);
        }}
      />

      <SelectAReceiver
        baseRoute={""}
        equipID={systemReassignEquipId}
        isOpen={isSystemReassginOpen}
        onClose={() => {
          push(`${baseRoute}`);
          setReassignEquipId(null);
          setIsSystemReassginOpen(!isSystemReassginOpen);
        }}
        employeeDataOptions={employeeDataOptions}
        equipmentsData={equipmentsData}
        singleEquipmentData={equipmentsData?.find(
          (row) => row.id === systemReassignEquipId,
        )}
        currentEmployee={currentEmployee as any}
        selectedRows={selectedRows}
        isReAssignInstance={true}
      />

      <ReassignSelectEquipmentModal
        isOpen={isSelectReceiverFlowTypeOpen}
        onClose={closeReassignTypeModal}
        selectedStep={selectedReceiverFlow}
        setSelectedStep={setSelectedReceiverFlow}
        handleContinue={continueReassignType}
      />

      <SelectAReceiver
        baseRoute={baseRoute}
        equipID={equipID}
        isOpen={isSelectReceiverOpen}
        onClose={() => setIsSelectReceiverOpen(!isSelectReceiverOpen)}
        onNext={handleSelectReceiverNext}
        employeeDataOptions={employeeDataOptions}
        equipmentsData={equipmentsData}
        isLoading={equipment_isLoading}
        isError={equipment_isError}
        setSelectedRows={handleClearSelection}
        currentEmployee={currentEmployee as any}
        selectedRows={selectedRows}
        editInstance={Boolean(actionEditChangeInstance)}
      />
      <SelectAReceieverDate
        baseRoute={baseRoute}
        equipID={equipID}
        isOpen={isSelectReceiverDateOpen}
        onClose={handleCollectDateClose}
        onNext={handleCollectDateNext}
        isEditable={Boolean(actionEditStoreInstance)}
        selectedRows={selectedRows}
        setSelectedRows={handleClearSelection}
      />
      <StorageDuration
        isOpen={isStorageDurationOpen}
        onClose={() => setIsStorageDurationOpen(!isStorageDurationOpen)}
        onNext={handleStorageDurageNext}
        equipID={equipID}
        equipmentsData={equipmentsData}
        isLoading={equipment_isLoading}
        isError={equipment_isError}
        setSelectedRows={handleClearSelection}
        isEditable={Boolean(actionEditStoreInstance)}
      />
      <SalesPrice
        baseRoute={baseRoute}
        isOpen={isSalesPriceOpen}
        onClose={() => setIsSalesPriceOpen(false)}
        equipID={equipID}
        companyId={companyId as string}
        equipmentsData={equipmentsData}
        onNext={handleSalesPriceNext}
        setSelectedRows={handleClearSelection}
      />

      <ActionsDrawer
        baseRoute={baseRoute}
        isOpen={isActionDrawerOpen}
        onClose={handleActionClose}
        onTransferEdit={toggleEditTransferAction}
        onSaleEdit={handleActionEditSale}
        onStoreEdit={handleActionEditStore}
      />
      <TransferActionsEdit
        isOpen={isEditTransfer}
        onClose={handleActionEditChangeClose}
        handleChange={handleActionEditChange}
      />

      <EquipmentsDetailItem
        isOpen={!equipmentId ? false : true}
        onClose={handleEquipmentDetailClose}
        onSave={() => null}
      />

      <EditSingleEquipmentDrawer
        isOpen={!edit_equipment_id ? false : true}
        onClose={handleEquipmentDetailClose}
      />

      <DisposeEquipmentModal
        isOpen={isDisposeEquipmentOpen}
        onClose={() => setIsDisposeEquipmentOpen(!isDisposeEquipmentOpen)}
        selectedStep={selectedDisposeEquipmentFlow}
        setSelectedStep={setSelectedDisposeEquipmentFlow}
        handleContinue={() =>
          decideDisposeEquipmentFlow(
            disposeTargetItems.length ? disposeTargetItems : selectedRows,
            "Dispose",
          )
        }
      />

      <StoreEquipmentModal
        // isOpen={true}
        isOpen={isStoreEquipmentOpen}
        onClose={() => setIsStoreEquipmentOpen(!isStoreEquipmentOpen)}
        selectedStep={selectedDisposeEquipmentFlow}
        setSelectedStep={setSelectedDisposeEquipmentFlow}
        handleContinue={() =>
          decideDisposeEquipmentFlow(
            disposeTargetItems.length ? disposeTargetItems : selectedRows,
            "Store",
          )
        }
      />

      {/* <FilterEquipments
        isOpen={isFilterEquipmentsOpen}
        onClose={toggleFilterEquipments}
        onSave={() => null}
      /> */}
    </>
  );
};

export default AllEquipmentsTable;
