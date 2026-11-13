import React from "react";
import TransactionsHistoryTable from "./TransactionsHistoryTable";
import { IAllTransaction } from "@/types/transactions";

interface Props {
  selectedValue: string;
  onHandleChange: (value: string) => void;
  transactionHistory: IAllTransaction[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
}

const TransactionHistory: React.FC<Props> = ({
  selectedValue,
  onHandleChange,
  transactionHistory,
  isLoading,
  isError,
}) => {
  return (
    <>
      <TransactionsHistoryTable
        selectedValue={selectedValue}
        onHandleChange={onHandleChange}
        transactionHistory={transactionHistory as IAllTransaction[]}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
};

export default TransactionHistory;
