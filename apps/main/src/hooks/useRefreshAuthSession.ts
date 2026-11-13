"use client";

import { useLazyGetUserProfileQuery } from "@/api/baseQueries/userApi/getUserProfile";
import { useAppDispatch } from "@/store";
import { setEncryptAuth } from "@/store/slices/authSlice";
import { encryptAuthData } from "@/utils/encryption/encryptAuthData";
import { useAuthUserDetail } from "@/utils/useAuthUser";

export function useRefreshAuthSession() {
  const dispatch = useAppDispatch();
  const { getAuthToken } = useAuthUserDetail();
  const auth_token = getAuthToken();
  const [fetchProfile] = useLazyGetUserProfileQuery();

  return async () => {
    if (!auth_token) return false;

    try {
      const profile = await fetchProfile().unwrap();
      dispatch(
        setEncryptAuth(
          encryptAuthData({
            auth_token,
            user: profile.data.user,
            company: profile.data.company,
            entities: profile.data.entities,
          }),
        ),
      );
      return true;
    } catch {
      return false;
    }
  };
}
