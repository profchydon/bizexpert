"use client";

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import customStorage from "./cutomStorage";
import onboardingSlice from "./slices/onboardingSlice";
import { authApi } from "@/api/baseQueries/authFlowApi";
import authSlice from "./slices/authSlice";
import employeeSlice from "./slices/employeeSlice";
import { companiesApi } from "@/api/baseQueries/companiesApi";
import { countriesApi } from "@/api/baseQueries/countriesApi";
import { userApi } from "@/api/baseQueries/userApi";
import { assetsApi } from "@/api/baseQueries/assetsApi";
import equipEmployeeSlice from "./slices/equipEmployeeSlice";
import utilSlice from "./slices/utilSlice";
import { cartApi } from "@/api/baseQueries/cartApi";
import { currenciesApi } from "@/api/baseQueries/currenciesApi";
import { plansApi } from "@/api/baseQueries/plansApi";
import equipmentSlice from "./slices/equipmentSlice";
import offboardingSlice from "./slices/offboardingSlice";
import offBoardActionSlice from "./slices/offBoardActionSlice";
import { feesApi } from "@/api/baseQueries/feesApi";
import onboardingBuytostorageSlice from "./slices/onboardingBuytostorageSlice";
import onboardingRenewStorageSlice from "./slices/onboardingRenewStorageSlice";
import { servicesApi } from "@/api/baseQueries/servicesApi";
import { orderTrackingApi } from "@/api/baseQueries/orderTrackingApi";
import { employeeVerificationApi } from "@/api/baseQueries/employeeVerificationApi";
import workspaceScopeSlice from "./slices/workspaceScopeSlice";

// REDUCERS SHOULD ONLY BE ADDED TO THIS CONFIG FOR PERSISTENCY
const appReducer = combineReducers({
  onboarding: onboardingSlice,
  auth: authSlice,
  employee: employeeSlice,
  equipEmployee: equipEmployeeSlice,
  utils: utilSlice,
  equipment: equipmentSlice,
  offboarding: offboardingSlice,
  offBoardAction: offBoardActionSlice,
  onboardingBuytostorage: onboardingBuytostorageSlice,
  onboardingRenewStorage: onboardingRenewStorageSlice,
  workspaceScope: workspaceScopeSlice,
});

const persistedReducers = persistReducer(
  {
    key: "rv2app",
    version: 2,
    storage: customStorage,
    blacklist: ["workspaceScope"],
  },
  appReducer,
);

export const reducer = {
  persistedReducers,
  [authApi.reducerPath]: authApi.reducer,
  [companiesApi.reducerPath]: companiesApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [countriesApi.reducerPath]: countriesApi.reducer,
  [assetsApi.reducerPath]: assetsApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [currenciesApi.reducerPath]: currenciesApi.reducer,
  [plansApi.reducerPath]: plansApi.reducer,
  [feesApi.reducerPath]: feesApi.reducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  [orderTrackingApi.reducerPath]: orderTrackingApi.reducer,
  [employeeVerificationApi.reducerPath]: employeeVerificationApi.reducer,
};
