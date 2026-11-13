"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import DevicesTable from "./DevicesTable";
import RemoveItems from "../../../../components/Drawers/RemoveItems";

import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { IEmployees } from "@/types/employees";
import { ICart } from "@/types/cart";
import displayErrorMessage from "@/utils/displayErrorMessage";
import routes from "@/routes";
import useCart from "@/hooks/useCart";
import {
  checkEmployeesItemsNotEmpty,
  deleteFulfilmentDate,
  removeItemFromCart,
  resetQuantity,
  updateAllFulfilmentDate,
  updateEmployeeItems,
  updateFulfilmentDate,
  updateNoteData,
} from "./utils";
import { format } from "date-fns";
import AddSetup from "@/components/Drawers/AddSetup";
import AddItems from "@/components/Drawers/AddItems";
import AddFulfilmentDateToAllModal from "./AddFulfilmentDateToAll";

const Devices = () => {
  const { push, back, isPending: isNavigatePending } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const employeeId = searchParams.get("employee_id");
  const devicesData = searchParams.get("data");

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const { carts: cartItemsData } = useCart();

  const [cartItems, setCartItems] = useState<ICart[]>([]);
  const [addSetupData, setAddSetupData] = useState<ICart[]>([]);
  const [addNote, setAddNote] = useState<string>();

  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);
  const [isRemoveItemsOpen, setIsRemoveItemsOpen] = useState(false);
  const [isAddSetupOpen, setIsAddSetupOpen] = useState(false);
  const [isConfirmSetupNavigating, setIsConfirmSetupNavigating] =
    useState(false);
  const [isAddFulfilmentDateToAllOpen, setIsAddFulfilmentDateToAllOpen] =
    useState(false);

  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [selectedRemoveValue, setSelectedRemoveValue] = useState<string[]>([]);

  const [fulfilmentDate, setFulfilmentDate] = useState<Date | string>("");
  const [fulfilmentDateToAll, setFulfilmentDateToAll] = useState<Date | string>(
    "",
  );

  const getAllocatedQuantityForItem = (itemId: string) => {
    return employees.reduce((acc, employee) => {
      const employeeItem = employee?.items?.find(
        (item) => item?.specification?.id === itemId,
      );
      return employeeItem ? acc + employeeItem.quantity : acc;
    }, 0);
  };

  useEffect(() => {
    const filteredCartItems = removeItemFromCart(
      cartItems,
      employees,
      cartItemsData,
    );

    if (devicesData) {
      const parsedData = JSON.parse(devicesData);
      setCartItems(parsedData);
      return;
    }

    setCartItems(resetQuantity(filteredCartItems));
  }, [employees, devicesData, cartItemsData]);

  useEffect(() => {
    if (!isConfirmSetupNavigating || isNavigatePending) {
      return;
    }

    setIsAddSetupOpen(false);
    setIsConfirmSetupNavigating(false);
  }, [isConfirmSetupNavigating, isNavigatePending]);

  const toggleAddItems = () => {
    setIsAddItemsOpen(true);
  };

  const closeAddItemsToggle = () => {
    push(routes.EQUIP_EMPLOYEE_DEVICES);
    setIsAddItemsOpen(!isAddItemsOpen);
  };

  const toggleRemoveItems = () => {
    setIsRemoveItemsOpen(true);
  };

  const closeRemoveItemsToggle = () => {
    push(routes.EQUIP_EMPLOYEE_DEVICES);
    setIsRemoveItemsOpen(!isRemoveItemsOpen);
  };

  const toggleAddSetup = () => {
    setIsAddSetupOpen(true);
  };

  const closeAddSetupToggle = () => {
    push(routes.EQUIP_EMPLOYEE_DEVICES);
    setIsAddSetupOpen(!isAddSetupOpen);
  };

  const validateItemEmptyState = () => {
    const checkEmployee = checkEmployeesItemsNotEmpty(employees);

    if (checkEmployee) {
      return true;
    }

    displayErrorMessage(
      `Empty items`,
      "Some employees have no items. Please, associate some item to proceed.",
    );
    return false;
  };

  const toggleOrderSummary = () => {
    const checkEmptyItemsCondition = validateItemEmptyState();
    if (!checkEmptyItemsCondition) {
      return checkEmptyItemsCondition;
    }

    if (cartItems.length > 0) {
      displayErrorMessage(
        "All equipment in the cart must be assigned to an employee. Kindly assign them or remove unassigned equipment from your cart to proceed.",
      );
      return;
    }

    return push(routes.EQUIP_EMPLOYEE_ORDER_SUMMARY);
  };

  const handleSelection = (value: string[]) => setSelectedValue(value);
  const handleRemoveSelection = (value: string[]) =>
    setSelectedRemoveValue(value);

  const incrementCartItemQuantity = (
    e: React.MouseEvent<HTMLButtonElement>,
    itemId: string,
  ) => {
    e.stopPropagation();

    setCartItems((prevCartItems) => {
      const initialDataItem = cartItemsData.find(
        (item) => item?.specification?.id === itemId,
      );

      if (!initialDataItem) {
        displayErrorMessage(`Asset with id ${itemId} not found in initialData`);
        return prevCartItems;
      }

      const totalAllocatedQuantity = getAllocatedQuantityForItem(itemId);

      const cartItemIndex = prevCartItems.findIndex(
        (item) => item.specification?.id === itemId,
      );
      if (
        cartItemIndex === -1 ||
        Number(prevCartItems[cartItemIndex].quantity) +
          1 +
          totalAllocatedQuantity >
          Number(initialDataItem?.quantity)
      ) {
        displayErrorMessage(
          `Cannot increment the quantity of this ${initialDataItem?.asset?.name}. It exceeds the available quantity of ${initialDataItem?.quantity}.`,
        );
        return prevCartItems;
      }

      const newCartItems = [...prevCartItems];
      newCartItems[cartItemIndex].quantity =
        Number(newCartItems[cartItemIndex].quantity) + 1;

      return newCartItems;
    });
  };

  const decrementCartItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    itemId: string,
  ) => {
    e.stopPropagation();
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item?.specification?.id === itemId && Number(item.quantity) > 1
          ? { ...item, quantity: Number(item.quantity) - 1 }
          : item,
      ),
    );
  };

  const updateCartItems = (
    cartItem: ICart[],
    selectedValue: string[],
    employees: IEmployees[],
    employeeId: string | null,
  ) => {
    if (!employeeId) {
      return;
    }

    const filterCartItems = cartItem?.filter((item) =>
      item?.specification?.id
        ? selectedValue.includes(item.specification.id)
        : false,
    );
    const updatedEmployeesCartItems = updateEmployeeItems(
      employees,
      employeeId,
      filterCartItems,
    );
    const formattedFulfilmentDate = fulfilmentDate
      ? format(fulfilmentDate as string, "yyyy-MM-dd")
      : null;
    const updatedEmployeesFulfilmentDate = updateFulfilmentDate(
      updatedEmployeesCartItems,
      employeeId,
      formattedFulfilmentDate || "",
    );
    if (filterCartItems) {
      dispatch(setSelectedEmployees(updatedEmployeesFulfilmentDate));
    }
  };

  const addMultipleItemsToEmployee = () => {
    updateCartItems(cartItems, selectedValue, employees, employeeId);

    push(routes.EQUIP_EMPLOYEE_DEVICES);
    setSelectedValue([]);
    setIsAddItemsOpen(false);
  };

  const handleItemRemove = () => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === employeeId
        ? {
            ...employee,
            items: employee?.items?.filter(
              (item) =>
                !selectedRemoveValue.includes(String(item.specification?.id)),
            ),
          }
        : employee,
    );

    if (updatedEmployees) {
      dispatch(setSelectedEmployees(updatedEmployees));
    }

    setSelectedRemoveValue([]);
    setIsRemoveItemsOpen(false);
  };

  const handleRemoveFulfilmentDate = () => {
    if (!employeeId) {
      return;
    }

    const updatedEmployees = deleteFulfilmentDate(employees, employeeId);

    if (updatedEmployees) {
      dispatch(setSelectedEmployees(updatedEmployees));
    }
  };

  const handleConfirmSetup = () => {
    if (!employeeId) {
      return;
    }

    const updatedEmployees = employees.map((employee) =>
      employee.id === employeeId
        ? { ...employee, items: [...addSetupData] }
        : employee,
    );

    const updateNote = updateNoteData(
      updatedEmployees,
      employeeId,
      addNote || "",
    );
    if (updateNote) {
      dispatch(setSelectedEmployees(updateNote));
    }

    setAddSetupData([]);
    setAddNote("");
    setIsConfirmSetupNavigating(true);
    push(routes.EQUIP_EMPLOYEE_DEVICES);
  };

  const handleAddFulfilmentDateToAll = () => {
    const formattedFulfilmentDate = fulfilmentDateToAll
      ? format(fulfilmentDateToAll as string, "yyyy-MM-dd")
      : null;
    const updatedEmployees = updateAllFulfilmentDate(
      employees,
      formattedFulfilmentDate || "",
    );
    if (updatedEmployees) {
      dispatch(setSelectedEmployees(updatedEmployees));
    }

    setFulfilmentDateToAll("");
    setIsAddFulfilmentDateToAllOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            <Link key="onboard-device" href={routes.EQUIP_EMPLOYEE}>
              Onboard device
            </Link>,
            <Link key="marketplace" href={routes.EQUIP_EMPLOYEE_MARKETPLACE}>
              Marketplace
            </Link>,
            <Link key="add-employees" href={routes.EQUIP_EMPLOYEE_EMPLOYEES}>
              Add Employees
            </Link>,
            <span key="add-devices" className="text-primary-600">
              Add Devices
            </span>,
          ]}
          pageTitle="Add devices"
          pageDescription="Easily provide your employees with the necessary resources to start their journey in your company."
          onBack={() => back()}
        >
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="font-semibold text-sm"
              onClick={() =>
                push(`${routes.EQUIP_EMPLOYEE_MARKETPLACE}?extra_items=true`)
              }
              data-testid="devices-button"
            >
              Add extra items
            </Button>
            <Button
              className="font-semibold text-sm"
              onClick={toggleOrderSummary}
              disabled={!checkEmployeesItemsNotEmpty(employees)}
              data-testid="devices-button-2"
            >
              Checkout items
            </Button>
          </div>
        </PageHeader>

        <DevicesTable
          toggleAddItems={toggleAddItems}
          toggleRemoveEmployee={toggleRemoveItems}
          toggleAddSetup={toggleAddSetup}
          toggleAddFulfilmentDateToAll={() =>
            setIsAddFulfilmentDateToAllOpen(true)
          }
        />
      </div>

      <AddItems
        isOpen={isAddItemsOpen}
        onClose={closeAddItemsToggle}
        onSave={addMultipleItemsToEmployee}
        data={cartItems}
        selectedValue={selectedValue}
        handleSelection={handleSelection}
        incrementCartItem={incrementCartItemQuantity}
        decrementCartItem={decrementCartItem}
        fulfilmentDate={fulfilmentDate}
        setFulfillmentDate={setFulfilmentDate}
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

      <RemoveItems
        isOpen={isRemoveItemsOpen}
        onClose={closeRemoveItemsToggle}
        onSave={handleItemRemove}
        selectedValue={selectedRemoveValue}
        handleSelection={handleRemoveSelection}
        handleRemoveFulfilmentDate={handleRemoveFulfilmentDate}
      />

      <AddFulfilmentDateToAllModal
        isOpen={isAddFulfilmentDateToAllOpen}
        onClose={() => setIsAddFulfilmentDateToAllOpen(false)}
        fulfilmentDate={fulfilmentDateToAll as Date}
        setFulfillmentDate={setFulfilmentDateToAll}
        onConfirm={handleAddFulfilmentDateToAll}
      />
    </div>
  );
};

export default Devices;
