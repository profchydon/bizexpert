"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import DevicesTable from "./AssignEmployeeTable";

import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { IEmployees } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import routes from "@/routes";
import AssignEmployeeTable from "./AssignEmployeeTable";
import AddItems from "./AddItems";
import { IEquipmentsInStorageByCountry } from "@/types/equipments";
import RemoveItems from "./RemoveItems";
import displayErrorMessage from "@/utils/displayErrorMessage";
import {
  checkEmployeesItemsNotEmpty,
  updateAllFulfilmentDate,
  updateFulfilmentDate,
  updateNoteData,
} from "./utils";
import UnassignedEmployees from "./UnassignedEmployees";
import AddSetup from "./AddSetup";
import AddFulfilmentDateToAllModal from "./AddFulfilmentDateToAll";
import { format } from "date-fns";

const AssignEmployees = () => {
  const { push, back, isPending: isNavigatePending } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const employeeId = searchParams.get("employee_id");

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const storageItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.storageToEmployeeItems,
  );

  const employeeItems = employees.find(
    (employee) => employee?.id === employeeId,
  )?.items;

  const [fulfilmentDate, setFulfillmentDate] = useState<Date | string>("");
  const [isAddFulfilmentDateToAllOpen, setIsAddFulfilmentDateToAllOpen] =
    useState(false);
  const [fulfilmentDateToAll, setFulfillmentDateToAll] = useState<
    Date | string
  >("");
  const [availabeStorageItems, setAvailabeStorageItems] = useState<
    IEquipmentsInStorageByCountry[]
  >([]);
  const [isAddSetupOpen, setIsAddSetupOpen] = useState(false);
  const [addSetupData, setAddSetupData] = useState<
    IEquipmentsInStorageByCountry[]
  >([]);
  const [addNote, setAddNote] = useState<string>();
  const [isConfirmSetupNavigating, setIsConfirmSetupNavigating] =
    useState(false);
  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);
  const [isRemoveItemsOpen, setIsRemoveItemsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [selectedRemoveItems, setSelectedRemoveItems] = useState<string[]>([]);

  const [isUnassignedModalOpen, setIsUnassignedModalOpen] = useState(false);

  const handleSelection = (value: string[]) => setSelectedValue(value);
  const handleRemoveSelection = (value: string[]) =>
    setSelectedRemoveItems(value);

  const assignItemsToEmployee = (
    employees: IEmployees[],
    employeeId: string,
    selectedItem: IEquipmentsInStorageByCountry[],
  ) => {
    return employees.map((employee) => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          items: [...(employee.items || []), ...selectedItem],
        };
      }
      return employee;
    });
  };

  const removeItemsFromEmployee = (
    employees: IEmployees[],
    employeeId: string,
    itemIds: string[],
  ) => {
    return employees.map((employee) => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          items: ((employee.items as unknown as any) || []).filter(
            (item: any) => !itemIds.includes(item.id),
          ),
        };
      }
      return employee;
    });
  };

  const handleAssign = () => {
    if (!employeeId) return;
    const selectedItemObjects =
      selectedValue.map(
        (id) => storageItems?.find((item) => item.id === id)!,
      ) ?? [];
    const newEmployees = assignItemsToEmployee(
      employees,
      employeeId,
      selectedItemObjects,
    ) as any;

    const formattedFulfilmentDate = !fulfilmentDate
      ? null
      : format(fulfilmentDate as string, "yyyy-MM-dd");

    const updatedEmployeesFulfilmentDate = updateFulfilmentDate(
      newEmployees,
      employeeId as string,
      formattedFulfilmentDate as string,
    );

    dispatch(setSelectedEmployees(updatedEmployeesFulfilmentDate));
    setSelectedValue([]);
    setIsAddItemsOpen(false);
    push(routes.STORAGE_ASSIGN_EMPLOYEES);
  };

  const handleRemove = () => {
    if (!employeeId || selectedRemoveItems.length === 0) return;
    const newEmployees = removeItemsFromEmployee(
      employees,
      employeeId,
      selectedRemoveItems,
    );
    dispatch(setSelectedEmployees(newEmployees));
    setSelectedRemoveItems([]);
    setIsRemoveItemsOpen(false);
    push(routes.STORAGE_ASSIGN_EMPLOYEES);
  };

  const unassignedEmployees = employees?.filter(
    (item) => !item?.items || item.items?.length === 0,
  );

  const handleCheckout = () => {
    if (unassignedEmployees?.length === 0) {
      push(routes?.STORAGE_ORDER_SUMMARY);
    } else {
      setIsUnassignedModalOpen(true);
    }
  };

  const removeAllUnassingedEmployee = () => {
    const unassignedIds = unassignedEmployees?.map((item) => item?.id);
    const filteredEmployees = employees?.filter(
      (item) => !unassignedIds?.includes(item.id),
    );
    dispatch(setSelectedEmployees(filteredEmployees));
    push(routes?.STORAGE_ORDER_SUMMARY);
  };

  const closeAddSetupToggle = () => {
    push(routes.STORAGE_ASSIGN_EMPLOYEES);
    setIsAddSetupOpen(!isAddSetupOpen);
  };

  const handleConfirmSetup = () => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === employeeId
        ? { ...employee, items: [...addSetupData] }
        : employee,
    );

    const updateNote = updateNoteData(
      updatedEmployees as IEmployees[],
      employeeId as string,
      addNote as string,
    );
    if (updateNote) {
      dispatch(setSelectedEmployees(updateNote));
    }

    setAddSetupData([]);
    setAddNote("");
    setIsConfirmSetupNavigating(true);
    push(routes.STORAGE_ASSIGN_EMPLOYEES);
  };

  const handleAddFulfilmentDateToAll = () => {
    const formattedFulfilmentDate = !fulfilmentDateToAll
      ? null
      : format(fulfilmentDateToAll as string, "yyyy-MM-dd");
    const updatedEmployees = updateAllFulfilmentDate(
      employees,
      formattedFulfilmentDate as string,
    );
    if (updatedEmployees) {
      dispatch(setSelectedEmployees(updatedEmployees));
    }

    setFulfillmentDateToAll("");
    setIsAddFulfilmentDateToAllOpen(false);
  };

  useEffect(() => {
    if (!isConfirmSetupNavigating || isNavigatePending) {
      return;
    }

    setIsAddSetupOpen(false);
    setIsConfirmSetupNavigating(false);
  }, [isConfirmSetupNavigating, isNavigatePending]);

  useEffect(() => {
    const assignedItemIds = new Set(
      employees.flatMap((emp) => emp.items?.map((item: any) => item.id) || []),
    );
    setAvailabeStorageItems(
      // @ts-ignore
      storageItems?.filter((item) => !assignedItemIds.has(item.id)),
    );
  }, [employees, storageItems]);

  return (
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            <Link href={routes.STORAGE}>Storage</Link>,
            <Link href={routes.STORAGE_SELECT_EMPLOYEES}>
              Select employees
            </Link>,
            <span className="text-primary-600">Assign to employees</span>,
          ]}
          pageTitle="Assign to employees"
          pageDescription="Assign devices in storage to your employees."
          onBack={() => back()}
        >
          <div className="flex gap-3">
            <Button
              className="font-semibold text-sm"
              onClick={handleCheckout}
              disabled={availabeStorageItems?.length > 0}
              isLoading={isNavigatePending}
              data-testid="assignemployees-button"
            >
              Checkout
            </Button>
          </div>
        </PageHeader>

        <AssignEmployeeTable
          toggleAddItems={() => {
            setIsAddItemsOpen(true);
          }}
          toggleAllFulfilmentStartDate={() =>
            setIsAddFulfilmentDateToAllOpen(true)
          }
          toggleRemoveEmployee={() => {
            setIsRemoveItemsOpen(true);
          }}
          toggleAddSetup={() => {
            setIsAddSetupOpen(true);
          }}
          itemCount={availabeStorageItems?.length}
        />

        <AddItems
          data={availabeStorageItems ?? []}
          isOpen={isAddItemsOpen}
          onClose={() => {
            setIsAddItemsOpen(false);
            push(routes.STORAGE_ASSIGN_EMPLOYEES);
          }}
          onSave={handleAssign}
          selectedValue={selectedValue}
          handleSelection={handleSelection}
          fulfilmentDate={fulfilmentDate}
          setFulfillmentDate={setFulfillmentDate}
        />

        <RemoveItems
          data={(employeeItems as unknown as any) ?? []}
          isOpen={isRemoveItemsOpen}
          onClose={() => {
            setIsRemoveItemsOpen(false);
            push(routes.STORAGE_ASSIGN_EMPLOYEES);
          }}
          onSave={handleRemove}
          selectedValue={selectedRemoveItems}
          handleSelection={handleRemoveSelection}
        />

        <AddSetup
          isOpen={isAddSetupOpen}
          onClose={closeAddSetupToggle}
          onSave={handleConfirmSetup}
          isSaveLoading={isConfirmSetupNavigating}
          addSetupData={addSetupData}
          setAddSetupData={setAddSetupData}
          addNote={addNote}
          setAddNote={setAddNote}
        />

        <AddFulfilmentDateToAllModal
          isOpen={isAddFulfilmentDateToAllOpen}
          onClose={() => setIsAddFulfilmentDateToAllOpen(false)}
          fulfilmentDate={fulfilmentDateToAll as Date}
          setFulfillmentDate={setFulfillmentDateToAll}
          onConfirm={handleAddFulfilmentDateToAll}
        />
      </div>

      <UnassignedEmployees
        isOpen={isUnassignedModalOpen}
        onClose={() => setIsUnassignedModalOpen(false)}
        items={unassignedEmployees}
        onRemove={removeAllUnassingedEmployee}
      />
    </div>
  );
};

export default AssignEmployees;
