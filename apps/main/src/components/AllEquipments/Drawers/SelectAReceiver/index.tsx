import React, { useState } from "react";

import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import { useDebounce } from "use-debounce";
import { useAppDispatch, useAppSelector } from "@/store";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  deleteOffboardingData,
  updateOffboardingData,
} from "@/store/slices/offboardingSlice";
import { Offboard_asset } from "@/types/offboarding";
import useKeyGenerator from "@/hooks/useKeyGenerator";
import useOffboarding from "@/hooks/useOffboarding";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useUnAndReAssignEquipmentAssigneeMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/unAndReAssignEquipmentAssignee";
import { cancelSelectAReceiver } from "./cancelSelectAReceiver";
import SelectAReceiverDrawer from "./SelectAReceiverDrawer";
import { submitOffboardingReceiver } from "./submitOffboardingReceiver";
import { submitReassignAssignee } from "./submitReassignAssignee";
import { FormattedItem, SelectAReceiverProps } from "./types";

const SelectAReceiver: React.FC<SelectAReceiverProps> = ({
  isOpen,
  baseRoute,
  onClose,
  onNext,
  employeeDataOptions,
  equipID,
  equipmentsData,
  singleEquipmentData,
  isLoading,
  isError,
  setSelectedRows,
  editInstance = false,
  modifyInstance = false,
  modifyInstanceData,
  currentEmployee,
  handleModifyInstanceSubmit,
  selectedRows,
  isReAssignInstance,
}) => {
  const companyId = useWorkspaceCompanyId();
  const dispatch = useAppDispatch();
  const { push } = useTransitionRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | null>(null);
  const [searchValue] = useDebounce(search, 2000);
  const [selectedCountyValue, setSelectedCountyValue] =
    useState<SingleSelectValue | null>(null);
  const [selectedEmployeeValue, setSelectedEmployeeValue] = useState<
    string | Record<string, SingleSelectValue | null>
  >();

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;
  const isMultiple =
    Array.isArray(offboardingData) && offboardingData?.length > 0;
  const { data: getEmployees } = useGetEmployeesQuery(
    {
      companyId: companyId!,
      params: {
        search: searchValue
          ? searchValue
          : selectedCountyValue?.value
            ? selectedCountyValue?.value
            : null,
        page,
      },
    },
    { skip: !companyId },
  );

  const empDataOptions = currentEmployee
    ? employeeDataOptions?.filter((emp) => emp.value !== currentEmployee.id)!
    : employeeDataOptions!;
  const employeeData = currentEmployee
    ? getEmployees?.data?.data.filter((emp) => emp.id !== currentEmployee?.id)!
    : getEmployees?.data?.data!;
  const { internalKey, generateKey } = useKeyGenerator();
  const { transformData } = useOffboarding();
  const [unAndReAssignEquipmentAssignee] =
    useUnAndReAssignEquipmentAssigneeMutation();

  const resetSearch = () => {
    setSearch(null);
    setSelectedCountyValue(null);
    generateKey();
  };

  const handleSubmit = () => {
    if (!isReAssignInstance) {
      submitOffboardingReceiver({
        modifyInstance,
        equipID,
        equipmentsData,
        offboardingData,
        selectedEmployeeValue,
        employeeData,
        transformData,
        dispatchUpdate: (data) => dispatch(updateOffboardingData(data)),
        onNext,
        setSelectedEmployeeValue,
        editInstance,
        resetSearch,
        onClose,
        handleModifyInstanceSubmit,
        baseRoute,
        push,
      });
      return;
    }

    void submitReassignAssignee({
      companyId: companyId!,
      equipID,
      selectedRows,
      singleEquipmentData,
      assignee: selectedEmployeeValue,
      assign: unAndReAssignEquipmentAssignee,
      onSuccess: onClose,
    });
  };

  const handleCancel = () => {
    cancelSelectAReceiver({
      offboardingData,
      equipID,
      editInstance,
      modifyInstance,
      baseRoute,
      push,
      dispatchDelete: (id) => dispatch(deleteOffboardingData(id)),
      resetAndClose: () => {
        setSelectedEmployeeValue("");
        resetSearch();
        setSelectedRows?.();
        onClose();
      },
    });
  };

  const handleSelectedEmployeeChange = (
    id: string,
    value: SingleSelectValue | null,
  ) => {
    setSelectedEmployeeValue((prev) => ({
      ...(typeof prev === "object" ? prev : {}),
      [id]: value,
    }));
  };

  return (
    <SelectAReceiverDrawer
      isOpen={isOpen}
      isLoading={isLoading}
      isError={isError}
      isMultiple={isMultiple}
      selectedEmployeeValue={selectedEmployeeValue}
      setSelectedEmployeeValue={setSelectedEmployeeValue}
      selectedCountyValue={selectedCountyValue}
      setSelectedCountyValue={setSelectedCountyValue}
      search={search}
      setSearch={setSearch}
      employeeData={employeeData}
      countryKey={internalKey as string}
      assigneeId={singleEquipmentData?.assignee?.id as string}
      empDataOptions={(empDataOptions as FormattedItem[]) || []}
      handleSelectedEmployeeChange={handleSelectedEmployeeChange}
      offboardingRows={
        (modifyInstance
          ? modifyInstanceData
          : offboardingData) as Offboard_asset
      }
      onCancel={handleCancel}
      onSave={handleSubmit}
    />
  );
};

export default React.memo(SelectAReceiver);
