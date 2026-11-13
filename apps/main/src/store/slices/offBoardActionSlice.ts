import { IEmployees } from "@/types/employees";
import { IEquipment } from "@/types/equipments";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type OFFBOARD_ACTION_TYPE = "transfer" | "store" | "sell";
interface OffboardEquipments {
  equipment_id: string;
  assignee: string | null;
  action: OFFBOARD_ACTION_TYPE;
}

export interface OffboardActionsData {
  assigneeDetail: IEmployees;
  equipmentDetail: IEquipment;
  employeeData?: IEmployees;
  collectionStartDate: string | null;
  action: OFFBOARD_ACTION_TYPE;
  storageDuration?: string;
}

interface OffboardAction {
  actionType?: OFFBOARD_ACTION_TYPE;
  selectedOffboardEquipments?: OffboardEquipments[];
  employee_country_id: string | null;
  collectionStartDate: string | null;
  offboardActionsData: OffboardActionsData[] | null;
  itemsToArchive?: IEquipment[];
  receiver?: IEmployees | null;
}

const initialState: OffboardAction = {
  actionType: undefined,
  selectedOffboardEquipments: [],
  employee_country_id: null,
  receiver: null,
  collectionStartDate: null,
  offboardActionsData: [],
  itemsToArchive: [],
};

export const offBoardActionSlice = createSlice({
  name: "offBoardActionSlice",
  initialState,
  reducers: {
    setActionType: (
      state,
      action: PayloadAction<OFFBOARD_ACTION_TYPE | undefined>,
    ) => {
      state.actionType = action.payload;
    },

    setOffBoardEmployeeCountryId: (state, action: PayloadAction<string>) => {
      state.employee_country_id = action.payload;
    },

    setOffBoardCollectionStartDate: (state, action: PayloadAction<string>) => {
      state.collectionStartDate = action.payload;
    },

    setReceiver: (state, action: PayloadAction<IEmployees>) => {
      state.receiver = action.payload;
    },

    setOffboardEquipments: (
      state,
      action: PayloadAction<OffboardEquipments[] | undefined>,
    ) => {
      state.selectedOffboardEquipments = action.payload;
    },

    removeOffboardEquipment: (
      state,
      action: PayloadAction<{
        items: OffboardEquipments[] | undefined;
        itemId: string;
      }>,
    ) => {
      const updatedItems = action.payload.items?.filter(
        (item) => item.equipment_id !== action.payload.itemId,
      );
      state.selectedOffboardEquipments = updatedItems!;
    },

    setOffboardActionsData: (
      state,
      action: PayloadAction<OffboardActionsData[] | null>,
    ) => {
      state.offboardActionsData = action.payload;
    },

    removeOffboardActionDataItem: (state, action: PayloadAction<string>) => {
      const data = state.offboardActionsData?.filter(
        (item) => item.equipmentDetail.id !== action.payload,
      )!;
      state.offboardActionsData = data;
    },

    setItemsToArchive: (
      state,
      action: PayloadAction<IEquipment[] | undefined>,
    ) => {
      state.itemsToArchive = action.payload;
    },

    resetOffboardActionState: (state) => {
      state.selectedOffboardEquipments = [];
      state.itemsToArchive = [];
      state.offboardActionsData = [];
      state.employee_country_id = null;
      state.collectionStartDate = null;
      state.receiver = null;
    },
  },
});

export const {
  setActionType,

  setOffboardEquipments,
  removeOffboardEquipment,

  setItemsToArchive,

  setOffBoardEmployeeCountryId,
  setOffBoardCollectionStartDate,

  setOffboardActionsData,
  removeOffboardActionDataItem,

  resetOffboardActionState,

  setReceiver,
} = offBoardActionSlice.actions;

export default offBoardActionSlice.reducer;
