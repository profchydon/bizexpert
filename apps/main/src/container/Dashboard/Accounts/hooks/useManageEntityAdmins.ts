"use client";

import { useMemo, useState } from "react";
import { useCancelEntityAdminInvitationMutation } from "@/api/baseQueries/companiesApi/entitiesApi/cancelEntityAdminInvitation";
import { entityAdminInvitationsFromResponse } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitation";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import {
  extractApiErrorMessage,
  isGenericApiErrorMessage,
} from "@/utils/extractApiErrorMessage";
import { useGetEntityAdminInvitationsQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntityAdminInvitations";
import { useInviteEntityAdminsMutation } from "@/api/baseQueries/companiesApi/entitiesApi/inviteEntityAdmins";
import type { EntityAdminRow } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityPersonLabel";
import { useRevokeEntityAdminMutation } from "@/api/baseQueries/companiesApi/entitiesApi/revokeEntityAdmin";
import { useUpdateEntityMutation } from "@/api/baseQueries/companiesApi/entitiesApi/updateEntity";
import {
  acceptedAdminCount,
  managedEntityAdmins,
  type ManagedEntityAdmin,
} from "../utils/managedEntityAdmins";
import {
  adminIdsAfterRevoke,
  nextAdminUserIds,
} from "../utils/entityDetailHeaderActions";

export function useManageEntityAdmins(
  entityId: string,
  entityName: string,
  admins: EntityAdminRow[],
  isPrimary: boolean,
  enabled: boolean,
) {
  const invitations = useGetEntityAdminInvitationsQuery(
    { entityId },
    { skip: !enabled || !entityId },
  );
  const [inviteAdmins, inviteState] = useInviteEntityAdminsMutation();
  const [revokeAdmin, revokeState] = useRevokeEntityAdminMutation();
  const [cancelInvitation, cancelState] =
    useCancelEntityAdminInvitationMutation();
  const [updateEntity, updateState] = useUpdateEntityMutation();
  const [error, setError] = useState<string | null>(null);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [pendingRevoke, setPendingRevoke] = useState<ManagedEntityAdmin | null>(
    null,
  );

  const rows = useMemo(
    () =>
      managedEntityAdmins(
        admins,
        entityAdminInvitationsFromResponse(invitations.data),
      ),
    [admins, invitations.data],
  );

  async function run(action: () => Promise<unknown>) {
    try {
      await action();
      setError(null);
      setPendingRevoke(null);
      return true;
    } catch (error_) {
      setPendingRevoke(null);
      const { title } = extractApiErrorMessage(
        error_,
        `Could not update admins for ${entityName}.`,
      );
      setError(isGenericApiErrorMessage(title) ? null : title);
      return false;
    }
  }

  function addAdmins(added: EntityAdminRow[]) {
    const ids = nextAdminUserIds(
      rows.map((admin) => admin.id),
      added.map((admin) => admin.id),
    ).filter((id) => !rows.some((admin) => admin.id === id));
    if (!ids.length || inviteState.isLoading) return;
    const names = added
      .filter((admin) => ids.includes(admin.id))
      .map((admin) => admin.name);
    setInvitingId(ids[0] ?? null);
    void run(() =>
      inviteAdmins({ entityId, body: { admin_user_ids: ids } }).unwrap(),
    )
      .then((sent) => {
        if (!sent) return;
        displaySuccessMessage(
          names.length > 1 ? "Invitations sent" : "Invitation sent",
          `We've invited ${names.join(", ")} to manage ${entityName}. They become an admin once they accept.`,
        );
      })
      .finally(() => setInvitingId(null));
  }

  function confirmRevoke() {
    if (!pendingRevoke) return;
    const admin = pendingRevoke;
    if (admin.pending && admin.invitationId) {
      void run(() =>
        cancelInvitation({
          entityId,
          invitationId: admin.invitationId as string,
        }).unwrap(),
      ).then((cancelled) => {
        if (!cancelled) return;
        displaySuccessMessage(
          "Invitation cancelled",
          `The invitation for ${admin.name} was cancelled.`,
        );
      });
      return;
    }
    if (acceptedAdminCount(rows) <= 1) {
      setPendingRevoke(null);
      return;
    }
    const notifyRevoked = (revoked: boolean) => {
      if (!revoked) return;
      displaySuccessMessage(
        "Access revoked",
        `${admin.name} is no longer an admin of ${entityName}.`,
      );
    };
    if (isPrimary) {
      void run(() =>
        updateEntity({
          entityId,
          body: {
            admin_user_ids: adminIdsAfterRevoke(
              admins.map((person) => person.id),
              admin.id,
            ),
          },
        }).unwrap(),
      ).then(notifyRevoked);
      return;
    }
    void run(() =>
      revokeAdmin({
        entityId,
        body: { user_id: admin.id },
      }).unwrap(),
    ).then(notifyRevoked);
  }

  return {
    rows,
    error,
    invitingId,
    isInviting: inviteState.isLoading,
    isSaving:
      inviteState.isLoading ||
      revokeState.isLoading ||
      cancelState.isLoading ||
      updateState.isLoading,
    pendingRevoke,
    requestRevoke: setPendingRevoke,
    cancelRevoke: () => setPendingRevoke(null),
    confirmRevoke,
    addAdmins,
  };
}
