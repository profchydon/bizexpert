import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig, AxiosError } from "axios";
import { axiosServer } from "./axios";
import { reduxStore } from "@/store";
import encryptPayload from "@/utils/encryption/encryptPayload";
import { unsetAuth } from "@/store/slices/authSlice";
import { resetOnboardingData } from "@/store/slices/onboardingSlice";
import { resetEquipEmployeeState } from "@/store/slices/equipEmployeeSlice";
import { AuthState } from "@/utils/useAuthUser";
import { decryptedAuthData } from "@/utils/encryption/encryptAuthData";
import { resolveWorkspaceRequestUrl } from "@/utils/workspace/workspaceApiCompanyId";
import { resolveAxiosRequestUrl } from "./resolveAxiosRequestUrl";
import { shouldClearSession } from "./shouldClearSession";
import { authorizationHeader } from "./authorizationHeader";

const defaultBaseQueryConfig = { baseUrl: "" };

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = defaultBaseQueryConfig): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      skipAuth?: boolean;
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params, headers, skipAuth }) => {
    try {
      let userToken;
      const excludePathFromEncryption = params?.excludePathFromEncryption;

      const encyptedData =
        reduxStore.getState().persistedReducers.auth.authData;

      if (encyptedData) {
        let { auth_token } = decryptedAuthData(encyptedData) as AuthState;
        userToken = auth_token;
      }

      let shouldEncrypt;

      const excludeUrl = [] as any;

      if (excludeUrl.includes(baseUrl + url)) {
        shouldEncrypt = false;
      }

      const activeEntityId =
        reduxStore.getState().persistedReducers.workspaceScope.activeEntityId;
      const primaryCompanyId = encyptedData
        ? (decryptedAuthData(encyptedData) as AuthState)?.company?.id
        : undefined;
      const scopedUrl = resolveWorkspaceRequestUrl(
        url,
        primaryCompanyId,
        activeEntityId,
      );

      const result = await axiosServer({
        url: resolveAxiosRequestUrl(baseUrl, scopedUrl),
        method,
        data:
          shouldEncrypt === false || excludePathFromEncryption
            ? data
            : encryptPayload(JSON.stringify(data)),
        params,
        headers: {
          ...headers,
          ...authorizationHeader(userToken, skipAuth),
        },
      });

      return {
        data: result.data,
        meta: {
          status: result.status,
          statusText: result.statusText,
          headers: result.headers,
        },
      };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      if (shouldClearSession(err.response?.status, err.response?.data)) {
        reduxStore.dispatch(unsetAuth());
        reduxStore.dispatch(resetOnboardingData());
        reduxStore.dispatch(resetEquipEmployeeState());
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };
