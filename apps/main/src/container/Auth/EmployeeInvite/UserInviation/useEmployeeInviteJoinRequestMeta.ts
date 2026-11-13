import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IUserInvitation } from "@/types/employees";

export const INVITE_JOIN_REQUEST_STORAGE_KEY =
  "employee_invite_join_request_meta";

export function useEmployeeInviteJoinRequestMeta(
  invitation: IUserInvitation | null,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const [joinRequestMeta, setJoinRequestMeta] = useState({
    companyId: "",
    joinRequestId: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(queryString);
    const incomingJoinRequestId =
      params.get("join_request_id") || params.get("joinRequestId") || "";
    const incomingCompanyId =
      params.get("company_id") || params.get("companyId") || "";

    const storedMetaString = sessionStorage.getItem(
      INVITE_JOIN_REQUEST_STORAGE_KEY,
    );
    let storedMeta: { companyId?: string; joinRequestId?: string } = {};
    if (storedMetaString) {
      try {
        storedMeta = JSON.parse(storedMetaString);
      } catch {
        storedMeta = {};
      }
    }

    const nextMeta = {
      companyId:
        incomingCompanyId ||
        storedMeta.companyId ||
        invitation?.company_id ||
        "",
      joinRequestId: incomingJoinRequestId || storedMeta.joinRequestId || "",
    };

    if (nextMeta.companyId || nextMeta.joinRequestId) {
      sessionStorage.setItem(
        INVITE_JOIN_REQUEST_STORAGE_KEY,
        JSON.stringify(nextMeta),
      );
    }

    setJoinRequestMeta(nextMeta);

    if (incomingCompanyId || incomingJoinRequestId) {
      params.delete("company_id");
      params.delete("companyId");
      params.delete("join_request_id");
      params.delete("joinRequestId");

      const cleanedQuery = params.toString();
      const cleanedPath = cleanedQuery
        ? `${pathname}?${cleanedQuery}`
        : pathname;
      router.replace(cleanedPath);
    }
  }, [invitation?.company_id, pathname, queryString, router]);

  return joinRequestMeta;
}
