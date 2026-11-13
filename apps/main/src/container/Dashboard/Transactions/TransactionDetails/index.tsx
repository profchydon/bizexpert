"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageState from "@/components/PageState";
import routes from "@/routes";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetTransactionDetailQuery } from "@/api/baseQueries/companiesApi/transactionsApi/getTransactionDetail";
import { releaseBodyScrollLock } from "@/utils/releaseBodyScrollLock";
import TransactionDetailsHeader from "./components/TransactionDetailsHeader";
import TransactionSummaryCard from "./components/TransactionSummaryCard";
import TransactionInvoiceCard from "./components/TransactionInvoiceCard";
import TransactionAssociatedOrdersCard from "./components/TransactionAssociatedOrdersCard";

const TransactionDetails = () => {
  const router = useRouter();
  const params = useParams();
  const companyId = useWorkspaceCompanyId();
  const transactionId = params?.transactionId as string;

  const { data, isLoading, isError } = useGetTransactionDetailQuery(
    {
      companyId,
      transactionId,
    },
    { skip: !companyId || !transactionId },
  );

  const transaction = data?.data;

  useEffect(() => {
    releaseBodyScrollLock();
  }, []);

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="flex flex-col gap-6 py-8">
        <TransactionDetailsHeader
          reference={transaction?.reference}
          status={transaction?.status}
          onBack={() => router.push(routes.TRANSACTIONS)}
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <TransactionSummaryCard transaction={transaction} />

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <TransactionInvoiceCard transaction={transaction} />
            <TransactionAssociatedOrdersCard transaction={transaction} />
          </div>
        </div>
      </div>
    </PageState>
  );
};

export default TransactionDetails;
