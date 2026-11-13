"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import SelectEmployee from "./SelectEmployee";
import PageHeader from "@/components/PageHeader";
import { useRouter, useSearchParams } from "next/navigation";
import EmployeeTable from "./EmployeeTable";
import routes from "@/routes";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  removeItemFromCart,
  resetQuantity,
  updateEmployeeItems,
} from "../Devices/utils";
import { IEmployees } from "@/types/employees";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { ICart } from "@/types/cart";
import AddItems from "@/components/Drawers/AddItems";
import Link from "next/link";
import useCart from "@/hooks/useCart";
import AddEmployees from "./AddEmployees";

const Employee = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const getDevices = searchParams.get("data_cart");
  const getEmployee_id = searchParams.get("employee_id");

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const { country } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const [isSelectEmployeeOpen, setIsSelectEmployeeOpen] = useState(false);
  const openSelectEmployee = () => setIsSelectEmployeeOpen(true);
  const closeSelectEmployee = () => setIsSelectEmployeeOpen(false);

  const [isImportEmployeeOpen, setIsImportEmployeeOpen] = useState(false);
  const openImportEmployee = () => setIsImportEmployeeOpen(true);
  const closeImportEmployee = () => setIsImportEmployeeOpen(false);

  const { carts: cartItemsData, isAddToCartLoading } = useCart();

  useEffect(() => {
    if (!country) {
      router.push(routes.EQUIP_EMPLOYEE);
    }
  }, []);

  useEffect(() => {
    const filteredEmployeesByCartInstance = employees?.map((emp) => ({
      ...emp,
      items: emp.items?.filter((empItem) =>
        cartItemsData?.some(
          (cartItem) =>
            cartItem?.specification?.id === empItem?.specification?.id,
        ),
      ),
    }));

    if (!isAddToCartLoading && employees && cartItemsData) {
      dispatch(setSelectedEmployees(filteredEmployeesByCartInstance));
    }
  }, [isAddToCartLoading]);

  const [cartItems, setCartItems] = useState<ICart[]>([]);
  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);

  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const handleSelection = (value: string[]) => {
    setSelectedValue(value);
  };

  const filteredCartItems = removeItemFromCart(
    cartItems,
    employees,
    cartItemsData,
  );

  const toggleAddItems = () => {
    if (isAddItemsOpen) {
      return (
        router.replace(routes.EQUIP_EMPLOYEE_EMPLOYEES),
        setIsAddItemsOpen(!isAddItemsOpen)
      );
    }
  };

  const incrementCartItemQuantity = (
    e: React.MouseEvent<HTMLButtonElement>,
    itemId: string,
  ) => {
    e.stopPropagation();
    setCartItems((prevCartItems) => {
      // Find the initial data item for the given assetId
      const initialDataItem = cartItemsData.find(
        (item) => item?.specification?.id === itemId,
      );

      // If the initial data item is not found, return the cartItems unchanged
      if (!initialDataItem) {
        displayErrorMessage(`Asset with id ${itemId} not found in initialData`);
        return prevCartItems;
      }

      // Calculate the total quantity already allocated to employees for the given assetId
      let totalAllocatedQuantity = 0;

      employees.forEach((employee: any) => {
        const employeeItem = employee?.items?.find(
          (item: any) => item?.specification?.id === itemId,
        );
        if (employeeItem) {
          totalAllocatedQuantity += employeeItem.quantity;
        }
      });

      // Find the cart item to increment
      const cartItemIndex = prevCartItems.findIndex(
        (item) => item.specification?.id === itemId,
      );

      if (cartItemIndex === -1) {
        displayErrorMessage(`Asset with id ${itemId} not found in cartItems`);
        return prevCartItems;
      }

      // Check if incrementing the cart item's quantity exceeds the available quantity in initialData
      if (
        Number(prevCartItems[cartItemIndex]?.quantity) +
          1 +
          totalAllocatedQuantity >
        Number(initialDataItem?.quantity)
      ) {
        return (
          displayErrorMessage(
            `Cannot increment the quantity of this ${initialDataItem?.asset?.name}.`,
            `It cannot Exceeds available quantity of ${initialDataItem?.quantity}.`,
          ),
          prevCartItems
        );
      }

      const newCartItems = [...prevCartItems];
      newCartItems[cartItemIndex] = {
        ...newCartItems[cartItemIndex],
        quantity: Number(newCartItems[cartItemIndex]?.quantity) + 1,
      };

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
    cartItem: any[],
    selectedValue: any[],
    employees: any[],
    // initialData: any[],
  ) => {
    const filterCartItems = cartItem.filter((item) =>
      selectedValue.includes(item.specification?.id),
    );

    const updatedEmployees = updateEmployeeItems(
      employees,
      String(getEmployee_id),
      filterCartItems,
    );

    if (filterCartItems) {
      return dispatch(setSelectedEmployees(updatedEmployees));
    }

    return;
  };

  const addMultipleItemsToEmployee = () => {
    updateCartItems(
      cartItems,
      selectedValue,
      employees,
      // cartItemsData,
    );

    return (
      router.push(routes.EQUIP_EMPLOYEE_EMPLOYEES),
      setSelectedValue([]),
      setIsAddItemsOpen(!isAddItemsOpen)
    );
  };

  useEffect(() => {
    if (!getDevices) {
      return setCartItems(resetQuantity(filteredCartItems));
    }
  }, [employees]);

  useEffect(() => {
    if (getDevices) {
      const parsedData: any[] = JSON.parse(getDevices);
      setCartItems(parsedData);
    }
  }, [getDevices]);

  const validateCountry = (employees: IEmployees[], country: string) => {
    const mismatchedEmployees = employees.filter(
      //  @ts-ignore
      (employee) => employee?.country !== country,
    );

    if (mismatchedEmployees.length === 0) {
      return true;
    } else {
      const employeeDetails = mismatchedEmployees[0];
      displayErrorMessage(
        `Location mismatch`,
        `Employee ${employeeDetails.first_name} ${employeeDetails.last_name} is not in ${country}. Please, update employee's country to proceed.`,
      );
      return false;
    }
  };

  const handleContinue = () => {
    // const countryName = country?.name?.split(" ")?.[0];
    const countryName = country?.name;
    const checkCountryMatch = validateCountry(employees, countryName as string);

    if (!checkCountryMatch) {
      return checkCountryMatch;
    }
    return router.push(`${routes.EQUIP_EMPLOYEE_DEVICES}`);
  };

  return (
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            <Link href={routes.EQUIP_EMPLOYEE_MARKETPLACE}>Marketplace</Link>,
            <span className="text-primary-600">Onboard employee</span>,
          ]}
          pageTitle="Add Employees"
          pageDescription="Easily provide your employees with the necessary resources to start their journey in your company."
          onBack={() => router.back()}
        >
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="text-sm border-0 bg-primary-50"
              onClick={openImportEmployee}
              data-testid="employee-button"
            >
              <span className="font-semibold text-primary-600">
                Import employees
              </span>
            </Button>

            <Button
              variant="outline"
              className="text-sm"
              onClick={openSelectEmployee}
              data-testid="employee-button-2"
            >
              <span className="font-semibold">Select employees</span>
            </Button>

            <Button
              className="text-sm"
              disabled={!employees || employees?.length < 1}
              onClick={handleContinue}
              data-testid="employee-button-3"
            >
              <span className="font-semibold">Continue</span>
            </Button>
          </div>
        </PageHeader>

        <EmployeeTable
          handleImport={openImportEmployee}
          handleSelect={openSelectEmployee}
          handleAddItems={() => setIsAddItemsOpen(!isAddItemsOpen)}
        />

        <SelectEmployee
          isOpen={isSelectEmployeeOpen}
          onClose={closeSelectEmployee}
        />

        {isImportEmployeeOpen && (
          <AddEmployees
            isOpen={isImportEmployeeOpen}
            onClose={closeImportEmployee}
            initialCountry={country?.name}
            lockCountryToInitial
            suppressRouteSync
          />
        )}

        <AddItems
          isOpen={isAddItemsOpen}
          onClose={toggleAddItems}
          onSave={() => addMultipleItemsToEmployee()}
          data={cartItems}
          selectedValue={selectedValue}
          handleSelection={handleSelection}
          incrementCartItem={incrementCartItemQuantity}
          decrementCartItem={decrementCartItem}
        />
      </div>
    </div>
  );
};

export default Employee;
