import { useState } from "react";
import { useInviteOfficeAdminsMutation } from "@/api/baseQueries/companiesApi/officesApi/inviteOfficeAdmins";
import { useRevokeOfficeAdminsMutation } from "@/api/baseQueries/companiesApi/officesApi/revokeOfficeAdmins";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import type { Office, OfficeAdminRef } from "../../types";
import { officeApiErrorMessage } from "../utils/officeApiError";

type Notify = (title: string, description: string) => void;

export function useOfficeAdmins(office: Office | undefined, notify: Notify) {
  const [manageOpen, setManageOpen] = useState(false);
  const [revokingAdmin, setRevokingAdmin] = useState<OfficeAdminRef | null>(
    null,
  );
  const [inviteAdmins, inviteResult] = useInviteOfficeAdminsMutation();
  const [revokeAdmins, revokeResult] = useRevokeOfficeAdminsMutation();

  async function handleAddAdmins(added: { id: string; name: string }[]) {
    const userIds = added.map((admin) => admin.id);
    if (!office?.subsidiaryId || userIds.length === 0) return;
    try {
      await inviteAdmins({
        companyId: office.subsidiaryId,
        officeId: office.id,
        payload: { admin_user_ids: userIds },
      }).unwrap();
      // A toast, not the page alert: the Manage admins drawer covers that.
      displaySuccessMessage(
        `${added.map((admin) => admin.name).join(", ")} ${added.length > 1 ? "have" : "has"} been invited successfully`,
        `They become an admin of ${office.name} once they accept.`,
      );
    } catch (error) {
      notify(
        "Admins not updated",
        officeApiErrorMessage(
          error,
          `Could not invite admins for ${office.name}.`,
        ),
      );
    }
  }

  async function handleRevokeAdmin() {
    if (!office?.subsidiaryId || !revokingAdmin?.id) {
      setRevokingAdmin(null);
      return;
    }
    try {
      await revokeAdmins({
        companyId: office.subsidiaryId,
        officeId: office.id,
        payload: { user_id: revokingAdmin.id },
      }).unwrap();
      notify(
        "Access revoked",
        `${revokingAdmin.name} is no longer an admin of ${office.name}.`,
      );
      setRevokingAdmin(null);
    } catch (error) {
      notify(
        "Access not revoked",
        officeApiErrorMessage(error, `Could not revoke ${revokingAdmin.name}.`),
      );
    }
  }

  return {
    manageOpen,
    setManageOpen,
    revokingAdmin,
    setRevokingAdmin,
    handleAddAdmins,
    handleRevokeAdmin,
    isInviting: inviteResult.isLoading,
    isRevoking: revokeResult.isLoading,
  };
}
