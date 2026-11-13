import React, { FC, useState } from "react";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import RevokeAdminModal from "./RevokeAdminModal";
import { useRevokeEmployeeAdminMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/revokeEmployeeAdmin";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useGetAdminEmployeesQuery } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/getAdminEmployees";
import { useInviteEmployeesMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/inviteEmployees";
import { useGetPendingInvitationsQuery } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/getPendingInvitations";
import TableHeader from "./tableHeader";
import AdminTable from "./AdminTable";
import PendingInviteTable from "./PendingInvite";
import DeleteInvitationModal from "./DeleteInvitationModal";
import { useDeleteInvitationMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/deleteInvitation";
import { useDebounce } from "use-debounce";

interface Props {
  onAddAdmin?: () => void;
}

const UsersTable: FC<Props> = ({ onAddAdmin }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [isRevoke, setIsRevoke] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const [searchAdminTable, setSearchAdminTable] = useState<string | null>(null);
  const [searchAdminTableValue] = useDebounce(searchAdminTable, 2000);

  const [searchPendingTable, setSearchPendingTable] = useState<string | null>(
    null,
  );
  const [searchPendingTableValue] = useDebounce(searchPendingTable, 2000);

  const [inviteAdmins] = useInviteEmployeesMutation();
  const [revokeEmployee, revokeEmployeeProps] =
    useRevokeEmployeeAdminMutation();
  const [deleteInvitation, deleteInvitationProps] =
    useDeleteInvitationMutation();

  const [
    selectedUserStatusTableFilterValue,
    setSelectedUserStatusTableFilterValue,
  ] = useState<string>("active");

  const {
    data: adminRes,
    isLoading: adminRes_isLoading,
    isError: adminRes_isError,
  } = useGetAdminEmployeesQuery(
    {
      companyId: company?.id,
      params: {
        search: !searchAdminTableValue ? null : searchAdminTableValue,
      },
    },
    { skip: !company?.id },
  );

  const admins = adminRes?.data?.data ?? [];
  const adminCurrentPage = (adminRes?.data?.current_page as number) || 1;
  const adminLastPage = (adminRes?.data?.last_page as number) || 1;

  const {
    data: pendingInviteRes,
    isLoading: pendingInviteRes_isLoading,
    isError: pendingInviteRes_isError,
  } = useGetPendingInvitationsQuery(
    {
      companyId: company?.id as string,
      params: {
        search: !searchPendingTableValue ? null : searchPendingTableValue,
      },
    },
    { skip: !company?.id },
  );

  const pendingInvitations = pendingInviteRes?.data?.data ?? [];
  const pendingInvitationsCurrentPage =
    (pendingInviteRes?.data?.current_page as number) || 1;
  const pendingInvitationsLastPage =
    (pendingInviteRes?.data?.last_page as number) || 1;

  const onResendInvite = async (value: string) => {
    const data = {
      companyId: company?.id as string,
      payload: {
        emails: [value],
        role: "Administrator",
      },
    };
    const { success } = await inviteAdmins(data).unwrap();
    if (success) {
      displaySuccessMessage("Invite resent successfully");
    }
  };

  const onRevokeAdmin = (value: string) => {
    setIsRevoke(true);
    setEmail(value);
  };

  const onDeleteInvitation = (value: string) => {
    setIsDelete(true);
    setEmail(value);
  };

  const isActiveTab = selectedUserStatusTableFilterValue === "active";
  const countLabel = isActiveTab
    ? `${admins.length} admin${admins.length === 1 ? "" : "s"}`
    : `${pendingInvitations.length} pending`;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <TableHeader
          selectedValue={selectedUserStatusTableFilterValue}
          onHandleChange={setSelectedUserStatusTableFilterValue}
          countLabel={countLabel}
          search={
            isActiveTab
              ? (searchAdminTable as string)
              : (searchPendingTable as string)
          }
          setSearch={isActiveTab ? setSearchAdminTable : setSearchPendingTable}
          onAddAdmin={onAddAdmin}
        />

        {selectedUserStatusTableFilterValue === "active" && (
          <AdminTable
            onResendInvite={onResendInvite}
            onSetEmail={onRevokeAdmin}
            admins={admins}
            isLoading={adminRes_isLoading}
            isError={adminRes_isError}
            current_page={adminCurrentPage}
            last_page={adminLastPage}
          />
        )}
        {selectedUserStatusTableFilterValue === "pending" && (
          <PendingInviteTable
            onResendInvite={onResendInvite}
            onSetEmail={onDeleteInvitation}
            pendingInviteRes={pendingInvitations}
            isLoading={pendingInviteRes_isLoading}
            isError={pendingInviteRes_isError}
            current_page={pendingInvitationsCurrentPage}
            last_page={pendingInvitationsLastPage}
          />
        )}
      </div>

      <RevokeAdminModal
        isOpen={isRevoke}
        onClose={() => setIsRevoke(false)}
        isRevokeButtonDisabled={revokeEmployeeProps.isLoading}
        onRevoke={async () => {
          await revokeEmployee({
            companyId: company?.id,
            email: email!,
          })
            .unwrap()
            .then(() => {
              displaySuccessMessage("Admin access has been revoked");
              setIsRevoke(false);
            });
        }}
      />

      <DeleteInvitationModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        isRevokeButtonDisabled={deleteInvitationProps.isLoading}
        onDelete={async () => {
          await deleteInvitation({
            companyId: company?.id,
            email: email!,
          })
            .unwrap()
            .then(() => {
              displaySuccessMessage("Invitation was canceled successfully");
              setIsDelete(false);
            });
        }}
      />
    </>
  );
};

export default UsersTable;
