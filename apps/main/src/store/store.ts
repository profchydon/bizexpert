import {
  configureStore,
  type ThunkAction,
  type Action,
} from "@reduxjs/toolkit";
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from "react-redux";

/* Instruments */
import { reducer } from "./rootReducer";
import { customLogger } from "./middlewares/customLogger";
import { rtkQueryErrorLogger } from "./middlewares/rtkQueryErrorLogger";
import { authSessionMiddleware } from "./middlewares/authSessionMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/api/baseQueries/authFlowApi";
import { companiesApi } from "@/api/baseQueries/companiesApi";
import { countriesApi } from "@/api/baseQueries/countriesApi";
import { userApi } from "@/api/baseQueries/userApi";
import { assetsApi } from "@/api/baseQueries/assetsApi";
import { cartApi } from "@/api/baseQueries/cartApi";
import { currenciesApi } from "@/api/baseQueries/currenciesApi";
import { plansApi } from "@/api/baseQueries/plansApi";
import { feesApi } from "@/api/baseQueries/feesApi";
import { servicesApi } from "@/api/baseQueries/servicesApi";
import { orderTrackingApi } from "@/api/baseQueries/orderTrackingApi";
import { employeeVerificationApi } from "@/api/baseQueries/employeeVerificationApi";
import "@/api/baseQueries/feesApi/getServiceFees";
import "@/api/baseQueries/feesApi/getStorageActionFees";
import "@/api/baseQueries/cartApi/getCarts";
import "@/api/baseQueries/cartApi/addToCart";
import "@/api/baseQueries/cartApi/clearCart";

const middleWares = [
  authSessionMiddleware,
  rtkQueryErrorLogger,
  customLogger,
  authApi.middleware,
  companiesApi.middleware,
  countriesApi.middleware,
  userApi.middleware,
  cartApi.middleware,
  assetsApi.middleware,
  currenciesApi.middleware,
  plansApi.middleware,
  feesApi.middleware,
  servicesApi.middleware,
  orderTrackingApi.middleware,
  employeeVerificationApi.middleware,
];

export const reduxStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat(
      middleWares,
    );
  },
});

setupListeners(reduxStore.dispatch);

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReduxState> =
  useReduxSelector;

/* Types */
export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;
