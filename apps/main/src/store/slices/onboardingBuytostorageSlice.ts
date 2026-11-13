import { IBuyToStorage } from "@/types/buytostorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const onboardingBuytostorageSlice = createSlice({
  name: "onboardingBuytostorageSlice",
  initialState: null as IBuyToStorage | IBuyToStorage[] | null,
  reducers: {
    setOnboardingBuytostorageData: (
      state,
      action: PayloadAction<IBuyToStorage | IBuyToStorage[]>,
    ) => {
      return action.payload;
    },
    addOnboardingBuytostorageData: (
      state,
      action: PayloadAction<IBuyToStorage | IBuyToStorage[]>,
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
    updateOnboardingBuytostorageData: (
      state,
      action: PayloadAction<IBuyToStorage | IBuyToStorage[]>,
    ) => {
      if (Array.isArray(action?.payload)) {
        return state
          ? Array.isArray(state)
            ? state?.map(
                (asset) =>
                  (action?.payload as IBuyToStorage[])?.find(
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
    deleteOnboardingBuytostorageData: (
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
    resetOnboardingBuytostorageData: () => {
      return null;
    },
  },
});

export const {
  setOnboardingBuytostorageData,
  addOnboardingBuytostorageData,
  updateOnboardingBuytostorageData,
  deleteOnboardingBuytostorageData,
  resetOnboardingBuytostorageData,
} = onboardingBuytostorageSlice.actions;

export default onboardingBuytostorageSlice.reducer;
