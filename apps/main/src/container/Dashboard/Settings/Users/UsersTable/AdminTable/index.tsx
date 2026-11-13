import React, { FC, useMemo } from "react";

import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import AdminTableActions from "./adminTableActions";
import AdminTableColumn from "./adminTableColumn";
import { IEmployees } from "@/types/employees";

interface Props {
  onResendInvite: (emails: string) => void;
  onSetEmail: (value: string) => void;
  admins: IEmployees[];
  isLoading: boolean;
  isError: boolean;
  current_page: number;
  last_page: number;
}

const AdminTable: FC<Props> = (props) => {
  const {
    onResendInvite,
    onSetEmail,
    admins,
    isLoading,
    isError,
    current_page,
    last_page,
  } = props;

  const columns: any = useMemo(
    () =>
      AdminTableColumn((item) => (
        <AdminTableActions
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
        data={admins}
        columns={columns}
        pagination={{
          currentPage: current_page,
          lastPage: last_page,
          onPageChange: () => null,
          prevLabel: "Previous",
        }}
        paginationClassName={referenceTablePaginationClass}
      >
        <EmptyTableInstance title="No Users" description="No users available" />
      </DataTable>
    </PageState>
  );
};

export default AdminTable;
