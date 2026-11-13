import { useAppSelector } from "@/store";
import { ICompany, IImpersonationSession, IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import { decryptedAuthData } from "../encryption/encryptAuthData";

export interface AuthState {
  auth_token?: string | null;
  user?: IUser;
  company?: ICompany;
  entities?: EntityMembership[];
  impersonation?: IImpersonationSession;
}

export const useAuthUserDetail = () => {
  const encryptedAuthdata = useAppSelector(
    (state) => state.persistedReducers.auth.authData,
  );
  const auth = decryptedAuthData(encryptedAuthdata);

  const getAuthDetails = () => auth;

  const getUserDetails = () => auth?.user;

  const getCompanyDetails = () => auth?.company;

  const getEntityMemberships = (): EntityMembership[] => auth?.entities ?? [];

  const getAuthToken = () => auth?.auth_token;

  const getUserFullname = () => {
    const user = auth?.user;
    return `${user?.first_name} ${user?.last_name}`;
  };

  const getUserInitials = () => {
    const name = getUserFullname();
    return `${name}`
      .split(" ")
      .map((x) => x.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getImpersonationDetails = () => getAuthDetails()?.impersonation;

  const isLoggedIn = () => Boolean(getAuthToken());

  return {
    getUserDetails,
    getUserFullname,
    getCompanyDetails,
    getEntityMemberships,
    getUserInitials,
    getAuthToken,
    getImpersonationDetails,
    isLoggedIn,
  };
};
