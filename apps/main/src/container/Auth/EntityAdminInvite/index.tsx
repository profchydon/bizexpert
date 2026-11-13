"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import employeeBanner from "@/assets/images/employeeBanner.png";
import PageState from "@/components/PageState";
import { useLazyGetEntityAdminInvitationQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntityAdminInvitation";
import { EntityAdminInvitePanel } from "./EntityAdminInvitePanel";
import { entityAdminInviteErrorMessage } from "./entityAdminInviteCopy";
import { resolveEmployeeEntityAdminInvitePath } from "./entityAdminInviteRouting";

export default function EntityAdminInvite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code")?.trim() ?? "";
  const [fetchInvitation, invitationQuery] =
    useLazyGetEntityAdminInvitationQuery();

  useEffect(() => {
    if (code) {
      fetchInvitation({ code });
    }
  }, [code, fetchInvitation]);

  const invitation = invitationQuery.data?.data;
  const employeeInvitePath = useMemo(
    () =>
      invitation ? resolveEmployeeEntityAdminInvitePath(invitation) : null,
    [invitation],
  );

  useEffect(() => {
    if (employeeInvitePath) {
      router.replace(employeeInvitePath);
    }
  }, [employeeInvitePath, router]);

  const errorStatus = invitationQuery.error
    ? (invitationQuery.error as { status?: number }).status
    : undefined;

  if (employeeInvitePath) {
    return (
      <div className="relative h-screen w-full">
        <div className="lg:w-1/2 px-10 sm:px-24 lg:px-16 xl:px-24">
          <PageState isLoading isError={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <div className="lg:w-1/2 px-10 sm:px-24 lg:px-16 xl:px-24">
        {!code ? (
          <div className="grid h-screen place-content-center py-20 text-center text-gray-600">
            This invitation link is missing a code.
          </div>
        ) : (
          <PageState
            isError={invitationQuery.isError}
            isLoading={invitationQuery.isLoading || invitationQuery.isFetching}
            errorMessage={entityAdminInviteErrorMessage(errorStatus)}
          >
            {invitation ? (
              <EntityAdminInvitePanel invitation={invitation} />
            ) : null}
          </PageState>
        )}
      </div>

      <div className="hidden h-screen lg:fixed lg:right-0 lg:top-0 lg:block lg:w-1/2">
        <Image
          src={employeeBanner}
          alt="Rayda Remote"
          className="w-full object-contain"
        />
      </div>
    </div>
  );
}
