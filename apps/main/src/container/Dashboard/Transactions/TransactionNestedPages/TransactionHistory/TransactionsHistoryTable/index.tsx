import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import TransactionsHistoryActions from "./tableActions";
import TransactionsHistoryTableColumn from "./tableColumns";
import TableHeader from "./tableHeader";
import TransactionHistoryEmptyInstance from "./TransactionHistoryEmptyInstance";
import { IAllTransaction } from "@/types/transactions";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import PageState from "@/components/PageState";

interface Props {
  selectedValue: string;
  onHandleChange: (value: string) => void;
  transactionHistory: IAllTransaction[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
}

const TransactionsHistoryTable: React.FC<Props> = ({
  selectedValue,
  onHandleChange,
  transactionHistory,
  isLoading,
  isError,
}) => {
  const router = useRouter();

  const columns: any = useMemo(
    () =>
      TransactionsHistoryTableColumn((item: IAllTransaction) => (
        <TransactionsHistoryActions
          item={item}
          onDownload={() => {}}
          onCancel={() => {}}
        />
      )),
    [],
  );
  return (
    <div>
      <Card>
        <CardHeader className="p-0 border-b border-border-secondary flex flex-col">
          <TableHeader
            selectedValue={selectedValue}
            onHandleChange={onHandleChange}
          />
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          <PageState
            isLoading={isLoading as boolean}
            isError={isError as boolean}
          >
            <DataTable
              data={(transactionHistory as IAllTransaction[]) || []}
              columns={columns}
            >
              <TransactionHistoryEmptyInstance
                handleOview={() => router.push(`${routes.OVERVIEW}`)}
              />
            </DataTable>
          </PageState>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsHistoryTable;
