import { transacthistory_emptystate } from "@/assets/images";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  handleOview: () => void;
}
const TransactionHistoryEmptyInstance: FC<Props> = ({ handleOview }) => {
  return (
    <div className="grid place-content-center py-11 w-full m-auto">
      <Image
        src={transacthistory_emptystate}
        alt="transacthistory_emptystate"
        className="mx-auto"
      />

      <div className="flex flex-col items-center text-center mt-5">
        <h5 className="text-gray-900 text-lg font-semibold">
          No transaction history yet
        </h5>
        <p className="text-gray-600 text-sm mt-2">
          This table will be updated when a payment is made.
        </p>
        <Button
          variant="primary"
          className="mt-8"
          onClick={handleOview}
          data-testid="transactionhistoryemptyinstance-button"
        >
          Overview
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistoryEmptyInstance;
