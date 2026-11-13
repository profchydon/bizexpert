import { IAddEquipment } from "@/types/equipments";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Equipment {
  importedEquipment?: IAddEquipment[] | undefined;
}

const initialState: Equipment = {
  importedEquipment: undefined,
};

export const equipmentSlice = createSlice({
  name: "equipmentSlice",
  initialState,
  reducers: {
    setImportedEquipment: (
      state,
      action: PayloadAction<IAddEquipment[] | undefined>,
    ) => {
      state.importedEquipment = action.payload;
    },
    resetImportedEquipment: (state) => {
      state.importedEquipment = undefined;
    },
    deleteImportedEquipment: (state, action: PayloadAction<number>) => {
      const filteredEmployees = state.importedEquipment?.filter(
        (equipment) => equipment.id !== action.payload,
      );
      state.importedEquipment = filteredEmployees;
    },
  },
});

export const {
  setImportedEquipment,
  resetImportedEquipment,
  deleteImportedEquipment,
} = equipmentSlice.actions;

export default equipmentSlice.reducer;
