"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import employeeBanner from "@/assets/images/employeeBanner.png";
import { useSearchParams } from "next/navigation";
import PageState from "@/components/PageState";
import { useLazyGetEntityAdminInvitationQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntityAdminInvitation";
import { useLazyGetInvitationQuery } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/getInvitation";
import { entityAdminInviteErrorMessage } from "@/container/Auth/EntityAdminInvite/entityAdminInviteCopy";
import { isEntityAdminEmployeeInviteFlow } from "@/container/Auth/EntityAdminInvite/entityAdminInviteRouting";
import UserInviation from "./UserInviation";
import { IUserInvitation } from "@/types/employees";

const EmployeeInvite = () => {
  const param = useSearchParams();
  const code = param.get("code") as string;
  const flow = param.get("flow");
  const entityInvitationCode =
    param.get("entity_invitation_code")?.trim() ?? "";
  const isEntityAdminFlow = isEntityAdminEmployeeInviteFlow(flow);

  const [invitation, setInvitation] = useState<IUserInvitation | null>(null);

  const [getInvitation, getInvitationProps] = useLazyGetInvitationQuery();
  const [fetchEntityAdminInvite, entityAdminInviteQuery] =
    useLazyGetEntityAdminInvitationQuery();

  const handleGetInvitation = async () => {
    const res = await getInvitation({ code }).unwrap();

    setInvitation(res.data);
  };

  useEffect(() => {
    if (code) {
      handleGetInvitation();
    }
  }, [code]);

  useEffect(() => {
    if (isEntityAdminFlow && entityInvitationCode) {
      fetchEntityAdminInvite({ code: entityInvitationCode });
    }
  }, [entityInvitationCode, fetchEntityAdminInvite, isEntityAdminFlow]);

  const isEntityAdminContextLoading =
    isEntityAdminFlow &&
    Boolean(entityInvitationCode) &&
    (entityAdminInviteQuery.isLoading || entityAdminInviteQuery.isFetching);

  const entityAdminErrorStatus = entityAdminInviteQuery.error
    ? (entityAdminInviteQuery.error as { status?: number }).status
    : undefined;

  const isLoading = getInvitationProps.isLoading || isEntityAdminContextLoading;
  const isError =
    getInvitationProps.isError ||
    (isEntityAdminFlow && entityAdminInviteQuery.isError);

  return (
    <div className="relative min-h-screen w-full lg:h-screen">
      <div className="h-full min-h-0 overflow-y-auto lg:w-1/2 lg:max-h-screen px-10 py-8 sm:px-24 sm:py-10 lg:px-16 lg:py-12 xl:px-24">
        <PageState
          isError={isError}
          isLoading={isLoading}
          errorMessage={
            isEntityAdminFlow && entityAdminInviteQuery.isError
              ? entityAdminInviteErrorMessage(entityAdminErrorStatus)
              : undefined
          }
        >
          <UserInviation
            invitation={invitation}
            entityAdminInvitation={entityAdminInviteQuery.data?.data ?? null}
            isEntityAdminFlow={isEntityAdminFlow}
          />
        </PageState>
      </div>

      <div className="hidden h-screen lg:fixed lg:right-0 lg:top-0 lg:block lg:w-1/2">
        <Image
          src={employeeBanner}
          alt="employee-banner"
          className="w-full object-contain"
        />
      </div>
    </div>
  );
};

export default EmployeeInvite;
