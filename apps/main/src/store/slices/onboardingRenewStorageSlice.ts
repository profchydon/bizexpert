import { IRenewStorage } from "@/types/renewStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const onboardingRenewStorageSlice = createSlice({
  name: "onboardingRenewStorageSlice",
  initialState: null as IRenewStorage | IRenewStorage[] | null,
  reducers: {
    setOnboardingRenewStorageData: (
      state,
      action: PayloadAction<IRenewStorage | IRenewStorage[]>,
    ) => {
      return action.payload;
    },
    addOnboardingRenewStorageData: (
      state,
      action: PayloadAction<IRenewStorage | IRenewStorage[]>,
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
    updateOnboardingRenewStorageData: (
      state,
      action: PayloadAction<IRenewStorage | IRenewStorage[]>,
    ) => {
      if (Array.isArray(action?.payload)) {
        return state
          ? Array.isArray(state)
            ? state?.map(
                (asset) =>
                  (action?.payload as IRenewStorage[])?.find(
                    (updated) => updated?.id === asset?.id,
                  ) || asset,
              )
            : action?.payload
          : action?.payload;
      } else if (
        state &&
        !Array.isArray(state) &&
        state?.id === action.payload?.id
      ) {
        return { ...state, ...action.payload };
      }
      return state;
    },
    deleteOnboardingRenewStorageData: (
      state,
      action: PayloadAction<string>,
    ) => {
      if (Array.isArray(state)) {
        const value = state.filter((asset) => asset?.id !== action.payload);
        if (value?.length < 1) {
          return null;
        } else {
          return value;
        }
      } else if (state && state?.id === action.payload) {
        return null;
      }
      return state;
    },
    resetOnboardingRenewStorageData: () => {
      return null;
    },
  },
});

export const {
  setOnboardingRenewStorageData,
  addOnboardingRenewStorageData,
  updateOnboardingRenewStorageData,
  deleteOnboardingRenewStorageData,
  resetOnboardingRenewStorageData,
} = onboardingRenewStorageSlice.actions;

export default onboardingRenewStorageSlice.reducer;
