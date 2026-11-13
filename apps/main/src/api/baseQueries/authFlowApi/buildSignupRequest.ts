import { ICompany, IUser } from "@/types/auth";

export type SignupRequest = {
  user?: Partial<IUser>;
  company?: Partial<ICompany>;
  skipDomainCheck?: boolean;
};

export function buildSignupRequest({
  skipDomainCheck,
  ...data
}: SignupRequest) {
  return {
    url: `/companies`,
    method: "POST",
    data,
    ...(skipDomainCheck ? { params: { skip_domain_check: true } } : {}),
    skipAuth: true,
  };
}
