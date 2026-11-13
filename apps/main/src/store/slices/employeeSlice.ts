import { IEmployees } from "@/types/employees";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { OffboardReviewEmployee } from "@/types/offboard";
import type { EquipReviewEmployee } from "@/container/Dashboard/Employees/OnboardDevices/equipTypes";

export interface ImportedEmployee {
  id: number;
  position: string;
  department: string;
  title: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  address: string;
  employmentType?: string;
  country?: string;
}

interface Employee {
  importedEmployee?: IEmployees[];
  selectedEmployee?: IEmployees[];
  offboardEmployees?: IEmployees[];
  offboardReview?: OffboardReviewEmployee[];
  equipEmployees?: IEmployees[];
  equipReview?: EquipReviewEmployee[];
  employeeDetail?: IEmployees;
  addEmployeeDetail?: IEmployees;
}

const initialState: Employee = {
  importedEmployee: undefined,
  selectedEmployee: undefined,
  offboardEmployees: undefined,
  offboardReview: undefined,
  equipEmployees: undefined,
  equipReview: undefined,
};

export const employeeSlice = createSlice({
  name: "employeeSlice",
  initialState,
  reducers: {
    setImportedEmployees: (
      state,
      action: PayloadAction<IEmployees[] | undefined>,
    ) => {
      state.importedEmployee = action.payload;
    },
    resetImportedEmployees: (state) => {
      state.importedEmployee = undefined;
    },
    setSelectedEmployees: (
      state,
      action: PayloadAction<IEmployees[] | undefined>,
    ) => {
      state.selectedEmployee = action.payload;
    },
    removeSelectedEmployee: (state, action: PayloadAction<string>) => {
      state.selectedEmployee = state.selectedEmployee?.filter(
        (item) => item.id !== action.payload,
      );
    },
    resetSelectedEmployees: (state) => {
      state.selectedEmployee = undefined;
    },

    setOffboardEmployees: (
      state,
      action: PayloadAction<IEmployees[] | undefined>,
    ) => {
      state.offboardEmployees = action.payload;
    },
    addOffboardEmployees: (state, action: PayloadAction<IEmployees[]>) => {
      const existing = state.offboardEmployees ?? [];
      const existingIds = new Set(existing.map((item) => String(item.id)));
      const additions = action.payload.filter(
        (item) => !existingIds.has(String(item.id)),
      );
      state.offboardEmployees = [...existing, ...additions];
    },
    removeOffboardEmployee: (state, action: PayloadAction<string>) => {
      state.offboardEmployees = state.offboardEmployees?.filter(
        (item) => String(item.id) !== action.payload,
      );
    },
    resetOffboardEmployees: (state) => {
      state.offboardEmployees = undefined;
    },

    setOffboardReview: (
      state,
      action: PayloadAction<OffboardReviewEmployee[] | undefined>,
    ) => {
      state.offboardReview = action.payload;
    },
    resetOffboardReview: (state) => {
      state.offboardReview = undefined;
    },

    setEquipEmployees: (
      state,
      action: PayloadAction<IEmployees[] | undefined>,
    ) => {
      state.equipEmployees = action.payload;
    },
    addEquipEmployees: (state, action: PayloadAction<IEmployees[]>) => {
      const existing = state.equipEmployees ?? [];
      const existingIds = new Set(existing.map((item) => String(item.id)));
      const additions = action.payload.filter(
        (item) => !existingIds.has(String(item.id)),
      );
      state.equipEmployees = [...existing, ...additions];
    },
    removeEquipEmployee: (state, action: PayloadAction<string>) => {
      state.equipEmployees = state.equipEmployees?.filter(
        (item) => String(item.id) !== action.payload,
      );
    },
    resetEquipEmployees: (state) => {
      state.equipEmployees = undefined;
    },

    setEquipReview: (
      state,
      action: PayloadAction<EquipReviewEmployee[] | undefined>,
    ) => {
      state.equipReview = action.payload;
    },
    resetEquipReview: (state) => {
      state.equipReview = undefined;
    },

    setEmployeeDetail: (
      state,
      action: PayloadAction<IEmployees | undefined>,
    ) => {
      state.employeeDetail = action.payload;
    },
    resetEmployeeDetail: (state) => {
      state.employeeDetail = undefined;
    },

    setAddEmployee: (state, action: PayloadAction<IEmployees | undefined>) => {
      state.addEmployeeDetail = action.payload;
    },
    resetAddEmployee: (state) => {
      state.addEmployeeDetail = undefined;
    },

    deleteImportedEmployee: (state, action: PayloadAction<number>) => {
      const filteredEmployees = state.importedEmployee?.filter(
        (employee) => employee.id !== action.payload,
      );
      state.importedEmployee = filteredEmployees;
    },
    resetEmployeeState: (state) => {
      return initialState;
    },
  },
});

export const {
  setImportedEmployees,
  resetImportedEmployees,

  setEmployeeDetail,
  resetEmployeeDetail,

  setSelectedEmployees,
  removeSelectedEmployee,
  resetSelectedEmployees,

  setOffboardEmployees,
  addOffboardEmployees,
  removeOffboardEmployee,
  resetOffboardEmployees,

  setOffboardReview,
  resetOffboardReview,

  setEquipEmployees,
  addEquipEmployees,
  removeEquipEmployee,
  resetEquipEmployees,

  setEquipReview,
  resetEquipReview,

  deleteImportedEmployee,

  setAddEmployee,
  resetAddEmployee,

  resetEmployeeState,
} = employeeSlice.actions;

export default employeeSlice.reducer;
