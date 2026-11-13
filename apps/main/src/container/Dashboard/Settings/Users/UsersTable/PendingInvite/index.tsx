import React, { FC, useMemo, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import PendingInviteTableActions from "./pendingTableActions";
import PendingInviteTableColumn from "./pendingTableColumn";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { IEmployees } from "@/types/employees";

interface Props {
  onResendInvite: (emails: string) => void;
  onSetEmail: (value: string) => void;
  pendingInviteRes: IEmployees[];
  isLoading: boolean;
  isError: boolean;
  current_page: number;
  last_page: number;
}

const PendingInviteTable: FC<Props> = (props) => {
  const {
    onResendInvite,
    onSetEmail,
    pendingInviteRes,
    isLoading,
    isError,
    current_page,
    last_page,
  } = props;

  const columns: any = useMemo(
    () =>
      PendingInviteTableColumn((item) => (
        <PendingInviteTableActions
          item={item}
          onResend={() => onResendInvite(item.email)}
          onDelete={async () => onSetEmail(item.email)}
        />
      )),
    [],
  );
  return (
    <PageState isLoading={isLoading} isError={isError}>
      <DataTable
        data={pendingInviteRes}
        columns={columns}
        pagination={{
          currentPage: current_page,
          lastPage: last_page,
          onPageChange: () => null,
          prevLabel: "Previous",
        }}
        paginationClassName={referenceTablePaginationClass}
      >
        <EmptyTableInstance
          title="No pending invitations"
          description="No pending invitations"
        />
      </DataTable>
    </PageState>
  );
};

export default PendingInviteTable;
