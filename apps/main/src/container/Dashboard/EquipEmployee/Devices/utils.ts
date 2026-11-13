import { ICart } from "@/types/cart";
import { IEmployees, IOrder } from "@/types/employees";
import { removeEmptyProperties } from "@/utils/removeEmptyProperties";

export const resetQuantity = (items: any[]) => {
  return items.map((item) => ({
    ...item,
    quantity: 1,
  }));
};

export const updateEmployeeItems = (
  employees: IEmployees[],
  employeeId: string,
  getItems: any[],
): IEmployees[] => {
  return employees.map((employee) => {
    if (employee.id !== employeeId) return employee;

    const updatedItems = employee.items ? [...employee.items] : [];

    getItems.forEach((newItem) => {
      const existingItem = updatedItems.find(
        (item) => item.specification?.id === newItem?.specification?.id,
      );

      if (existingItem) {
        updatedItems[updatedItems.indexOf(existingItem)] = {
          ...existingItem,
          quantity: existingItem.quantity + newItem.quantity,
        };
      } else {
        updatedItems.push({ ...newItem });
      }
    });

    return { ...employee, items: updatedItems };
  });
};

export const removeItemFromCart = (
  cartItem: any[],
  employees: any[],
  initialData: any[],
) => {
  const getTotalQuantity = (asset_id: string) => {
    let totalQuantity = 0;
    employees?.forEach((employee) => {
      employee?.items?.forEach((item: any) => {
        if (item?.specification?.id === asset_id) {
          totalQuantity += Number(item?.quantity);
        }
      });
    });
    return totalQuantity;
  };

  const getInitialQuantity = (specification_id: string) => {
    const initialItem = initialData.find(
      (item) => item?.specification?.id === specification_id,
    );
    return initialItem ? initialItem.quantity : 0;
  };

  // Filter the cartItem array based on selectedValue and the condition
  const filteredCartItems = initialData.filter((cart) => {
    const specification_id = cart?.specification?.id;
    const initialQuantity = getInitialQuantity(specification_id);
    const totalQuantity = getTotalQuantity(specification_id);
    return totalQuantity < initialQuantity;
  });

  return filteredCartItems;
};

export const checkEmployeesItemsNotEmpty = (employees: any[]): boolean => {
  return employees?.every(
    (employee) => employee.items && employee.items.length > 0,
  );
};

export const transformEmployeesToOrders = (
  employees: IEmployees[],
): IOrder[] => {
  const orders: IOrder[] = [];

  employees.forEach((employee: any) => {
    employee.items.forEach((item: any) => {
      orders.push({
        asset_pricing_id: item?.pricing?.id,
        employee_id: employee.id,
        quantity: item.quantity,
        note: employee?.note,
        catalog_request_id: employee.requestId ? employee.requestId : undefined,
        fulfillment_date: employee?.fulfillment_date,
        device_setup: item?.device_setup,
      });
    });
  });

  const cleanedOrders = removeEmptyProperties(orders);
  return cleanedOrders;
};

export const emptyEmployeeItems = (employees: IEmployees[]): IEmployees[] => {
  return employees?.map((employee) => ({
    ...employee,
    items: [],
  }));
};

export const updateFulfilmentDate = (
  employees: IEmployees[],
  employeeId: string,
  fulfilment_date: string,
): IEmployees[] => {
  return employees.map((employee) => {
    if (employee.id === employeeId) {
      return { ...employee, fulfilment_date };
    }
    return employee;
  });
};

export const deleteFulfilmentDate = (
  employees: IEmployees[],
  employeeId: string,
): IEmployees[] => {
  return employees.map((employee) => {
    if (employee.id === employeeId) {
      const { fulfilment_date, ...rest } = employee;
      return rest;
    }
    return employee;
  });
};

export const updateDeviceSetup = (
  addSetupData: ICart[],
  assetId: string,
  specificationId: string,
  device_setup: unknown,
): ICart[] => {
  return addSetupData.map((item) => {
    if (
      item.asset.id === assetId &&
      item.specification.id === specificationId
    ) {
      return { ...item, device_setup };
    }
    return item;
  });
};

export const updateAllFulfilmentDate = (
  employees: IEmployees[],
  fulfilment_date: string,
): IEmployees[] => {
  return employees.map((employee) => {
    return {
      ...employee,
      fulfilment_date,
    };
  });
};

export const updateNoteData = (
  employees: IEmployees[],
  employeeId: string,
  note: string,
): IEmployees[] => {
  return employees.map((employee) => {
    if (employee.id === employeeId) {
      return { ...employee, note };
    }
    return employee;
  });
};
