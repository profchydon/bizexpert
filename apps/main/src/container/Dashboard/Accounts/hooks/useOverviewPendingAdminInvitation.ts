"use client";

import { useGetEntityAdminInvitationsQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntityAdminInvitations";
import { entityAdminInvitationsFromResponse } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitation";
import { overviewShowsPendingAdminInvitation } from "../utils/overviewAdminInvitation";

export function useOverviewPendingAdminInvitation(
  entityId: string,
  adminCount: number,
) {
  const query = useGetEntityAdminInvitationsQuery(
    { entityId },
    { skip: !entityId || adminCount > 0 },
  );

  return overviewShowsPendingAdminInvitation(
    adminCount,
    entityAdminInvitationsFromResponse(query.data),
  );
}
