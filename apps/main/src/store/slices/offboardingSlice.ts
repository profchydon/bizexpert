import { Offboard_asset } from "@/types/offboarding";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const offboardingSlice = createSlice({
  name: "offboardingSlice",
  initialState: null as Offboard_asset | Offboard_asset[] | null,
  reducers: {
    setOffboardingData: (
      state,
      action: PayloadAction<Offboard_asset | Offboard_asset[]>,
    ) => {
      return action.payload;
    },
    addOffboardingData: (
      state,
      action: PayloadAction<Offboard_asset | Offboard_asset[]>,
    ) => {
      const payloadArray = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      if (Array.isArray(state)) {
        const newItems = payloadArray.filter(
          (newItem) =>
            !state.some((existingItem) => existingItem.id === newItem.id),
        );
        return [...state, ...newItems];
      } else if (state) {
        const newItems = payloadArray.filter(
          (newItem) => newItem.id !== state.id,
        );
        return [state, ...newItems];
      }

      return payloadArray;
    },
    updateOffboardingData: (
      state,
      action: PayloadAction<Offboard_asset | Offboard_asset[]>,
    ) => {
      if (Array.isArray(action?.payload)) {
        return state
          ? Array.isArray(state)
            ? state?.map(
                (asset) =>
                  (action?.payload as Offboard_asset[])?.find(
                    (updated) => updated.id === asset.id,
                  ) || asset,
              )
            : action?.payload
          : action?.payload;
      } else if (
        state &&
        !Array.isArray(state) &&
        state.id === action.payload.id
      ) {
        return { ...state, ...action.payload };
      }
      return state;
    },
    deleteOffboardingData: (state, action: PayloadAction<string>) => {
      if (Array.isArray(state)) {
        const value = state.filter((asset) => asset.id !== action.payload);
        if (value?.length < 1) {
          return null;
        } else {
          return value;
        }
      } else if (state && state.id === action.payload) {
        return null;
      }
      return state;
    },
    resetOffboardingData: () => {
      return null;
    },
  },
});

export const {
  setOffboardingData,
  addOffboardingData,
  updateOffboardingData,
  deleteOffboardingData,
  resetOffboardingData,
} = offboardingSlice.actions;

export default offboardingSlice.reducer;
