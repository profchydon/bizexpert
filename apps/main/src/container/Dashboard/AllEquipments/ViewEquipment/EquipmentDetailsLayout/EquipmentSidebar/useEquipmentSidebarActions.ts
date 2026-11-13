"use client";

import { IEquipment } from "@/types/equipments";
import { Offboard_asset } from "@/types/offboarding";
import { useAppDispatch, useAppSelector } from "@/store";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { useMemo, useState } from "react";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import type { IEmployees } from "@/types/employees";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { startEquipmentOffboardReassign } from "@/components/AllEquipments/startEquipmentOffboardReassign";
import { startEquipmentOffboardStore } from "@/components/AllEquipments/startEquipmentOffboardStore";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

export const useEquipmentSidebarActions = (equipment: IEquipment) => {
  const dispatch = useAppDispatch();
  const { push } = useTransitionRouter();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const { data: getEmployees } = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );
  const employees = useMemo(
    () => (getEmployees?.data?.data as IEmployees[]) || [],
    [getEmployees],
  );
  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const [isStorageDurationOpen, setIsStorageDurationOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isSelectReceiverDateOpen, setIsSelectReceiverDateOpen] =
    useState(false);
  const [isSalesPriceOpen, setIsSalesPriceOpen] = useState(false);
  const [isSelectReceiverOpen, setIsSelectReceiverOpen] = useState(false);
  const [isSelectReceiverFlowTypeOpen, setIsSelectReceiverFlowTypeOpen] =
    useState(false);
  const [selectedReceiverFlow, setSelectedReceiverFlow] = useState("");
  const [isSystemReassginOpen, setIsSystemReassginOpen] = useState(false);

  const normalizedStatus = useMemo(() => {
    const s = equipment?.status;
    return typeof s === "string"
      ? s.toLowerCase()
      : String(s ?? "").toLowerCase();
  }, [equipment?.status]);

  const toggleNote = () => setIsAddNoteOpen((prev) => !prev);
  const toggleSelectReceiverDate = () =>
    setIsSelectReceiverDateOpen((prev) => !prev);

  const toggleSalesPrice = (item?: IEquipment) => {
    if (item && Array.isArray(offboardingData)) {
      setIsSalesPriceOpen((prev) => !prev);
      return;
    }
    setIsSalesPriceOpen((prev) => !prev);
  };

  const toggleSelecTranferMethodModal = (item?: IEquipment) => {
    if (item && Array.isArray(offboardingData)) {
      setIsSelectReceiverFlowTypeOpen((prev) => !prev);
      return;
    }
    setIsSelectReceiverFlowTypeOpen((prev) => !prev);
  };

  const toggleSelectReceiver = (item?: IEquipment) => {
    setIsSelectReceiverOpen((prev) => !prev);
    if (item && Array.isArray(offboardingData)) return;
  };

  const decideTransferFlow = (item?: IEquipment) => {
    const selectItemInstance: Record<string, () => void> = {
      "System reassignment": () => setIsSystemReassginOpen(true),
      "Off-boarding equipment": () =>
        startEquipmentOffboardReassign({
          item: item ?? equipment,
          selectedRows: [],
          employees,
          dispatch,
          push,
        }),
    };
    selectItemInstance?.[selectedReceiverFlow]?.();
    setIsSelectReceiverFlowTypeOpen(false);
  };

  const requireCountry = (action: () => void) => {
    if (!equipment?.country) {
      displayErrorMessage("Equipment doesnt have an assigned country");
      return;
    }
    action();
  };

  const handleTransferEquipment = () => {
    requireCountry(() => {
      if (normalizedStatus === "unassigned") {
        setIsSystemReassginOpen(true);
        return;
      }
      if (normalizedStatus === "assigned") {
        toggleSelecTranferMethodModal(equipment as any);
      }
    });
  };

  const handleStoreEquipment = () => {
    requireCountry(() => {
      startEquipmentOffboardStore({
        item: equipment,
        selectedRows: [],
        employees,
        dispatch,
        push,
      });
    });
  };

  const handleSellEquipment = () => {
    requireCountry(() => toggleSalesPrice(equipment as any));
  };

  return {
    offboardingData,
    normalizedStatus,
    drawerState: {
      isStorageDurationOpen,
      isAddNoteOpen,
      isSelectReceiverDateOpen,
      isSalesPriceOpen,
      isSelectReceiverOpen,
      isSelectReceiverFlowTypeOpen,
      isSystemReassginOpen,
      selectedReceiverFlow,
    },
    drawerHandlers: {
      setSelectedReceiverFlow,
      handleCollectDateClose: () => setIsSelectReceiverDateOpen(false),
      handleStorageDurageNext: toggleSelectReceiverDate,
      handleSalesPriceNext: toggleSelectReceiverDate,
      handleSelectReceiverNext: toggleSelectReceiverDate,
      onStorageDurationClose: () => setIsStorageDurationOpen((prev) => !prev),
      onSalesPriceClose: () => setIsSalesPriceOpen(false),
      onSelectReceiverClose: () => setIsSelectReceiverOpen((prev) => !prev),
      onSelectReceiverFlowTypeClose: () =>
        setIsSelectReceiverFlowTypeOpen((prev) => !prev),
      onSelectReceiverFlowContinue: () => decideTransferFlow(equipment),
      onSystemReassignClose: () => setIsSystemReassginOpen((prev) => !prev),
      onAddNoteClose: () => setIsAddNoteOpen((prev) => !prev),
    },
    actionHandlers: {
      toggleNote,
      handleTransferEquipment,
      handleStoreEquipment,
      handleSellEquipment,
    },
  };
};
