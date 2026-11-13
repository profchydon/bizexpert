import { ICompany, IUser } from "@/types/auth";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Onboarding {
  user?: IUser;
  company?: ICompany;
}

const initialState: Onboarding = {
  user: undefined,
  company: undefined,
};

export const onboardingSlice = createSlice({
  name: "onboardingSlice",
  initialState,
  reducers: {
    setOnboardingData: (
      state,
      action: PayloadAction<{ company?: ICompany; user?: IUser }>,
    ) => {
      state.company = action.payload.company;
      state.user = action.payload.user;
    },
    resetOnboardingData: (state) => {
      return initialState;
    },
  },
});

export const { setOnboardingData, resetOnboardingData } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;
