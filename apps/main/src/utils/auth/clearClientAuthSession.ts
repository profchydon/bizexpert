import { authApi } from "@/api/baseQueries/authFlowApi";
import { companiesApi } from "@/api/baseQueries/companiesApi";
import { countriesApi } from "@/api/baseQueries/countriesApi";
import { employeeVerificationApi } from "@/api/baseQueries/employeeVerificationApi";
import { feesApi } from "@/api/baseQueries/feesApi";
import { plansApi } from "@/api/baseQueries/plansApi";
import { currenciesApi } from "@/api/baseQueries/currenciesApi";
import { assetsApi } from "@/api/baseQueries/assetsApi";
import { cartApi } from "@/api/baseQueries/cartApi";
import { orderTrackingApi } from "@/api/baseQueries/orderTrackingApi";
import { servicesApi } from "@/api/baseQueries/servicesApi";
import { userApi } from "@/api/baseQueries/userApi";
import { ReduxDispatch } from "@/store";
import { resetAnalytics } from "@/lib/analytics";
import { unsetAuth } from "@/store/slices/authSlice";
import {
  resetEmployeeState,
  setSelectedEmployees,
} from "@/store/slices/employeeSlice";
import { resetEquipEmployeeState } from "@/store/slices/equipEmployeeSlice";
import { resetOnboardingData } from "@/store/slices/onboardingSlice";
import { clearWorkspaceScope } from "@/store/slices/workspaceScopeSlice";
import { WORKSPACE_SCOPE_STORAGE_KEY } from "@/utils/workspace/activeWorkspace";

const PERSISTED_STORE_KEY = "persist:rv2app";
const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";

interface ClearClientAuthSessionOptions {
  preservePostLoginRedirect?: boolean;
}

export const clearClientAuthSession = (
  dispatch: ReduxDispatch,
  options: ClearClientAuthSessionOptions = {},
) => {
  const { preservePostLoginRedirect = false } = options;

  dispatch(unsetAuth());
  dispatch(resetOnboardingData());
  dispatch(setSelectedEmployees([]));
  dispatch(resetEquipEmployeeState());
  dispatch(resetEmployeeState());
  dispatch(clearWorkspaceScope());

  dispatch(authApi.util.resetApiState());
  dispatch(companiesApi.util.resetApiState());
  dispatch(userApi.util.resetApiState());
  dispatch(countriesApi.util.resetApiState());
  dispatch(assetsApi.util.resetApiState());
  dispatch(cartApi.util.resetApiState());
  dispatch(currenciesApi.util.resetApiState());
  dispatch(plansApi.util.resetApiState());
  dispatch(feesApi.util.resetApiState());
  dispatch(servicesApi.util.resetApiState());
  dispatch(orderTrackingApi.util.resetApiState());
  dispatch(employeeVerificationApi.util.resetApiState());

  if (globalThis.window !== undefined) {
    resetAnalytics();
    globalThis.window.localStorage.removeItem(PERSISTED_STORE_KEY);
    globalThis.window.sessionStorage.removeItem(WORKSPACE_SCOPE_STORAGE_KEY);
    if (!preservePostLoginRedirect) {
      globalThis.window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    }
  }
};
