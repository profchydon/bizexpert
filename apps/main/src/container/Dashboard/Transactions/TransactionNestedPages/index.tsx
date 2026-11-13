import React, { useEffect, useState } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { TableListLocationProvider } from "@/hooks/tableListLocation";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { useGetTransactionsQuery } from "@/api/baseQueries/companiesApi/transactionsApi/getTransactions";
import { useSearchParams } from "next/navigation";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useVerifyOrderPaymentQuery } from "@/api/baseQueries/companiesApi/transactionsApi/verifyOrderPayment";
import PaymentSuccessInstanceModal from "../../EquipEmployee/Devices/PaymentSuccessInstance";
import PaymentErrorInstanceModal from "../../EquipEmployee/Devices/PaymentErrorInstance";
import useCart from "@/hooks/useCart";
import Loader from "@/components/Loader";
import Pagination from "@/components/Custom/Pagination";
import TransactionToolbar from "../components/TransactionToolbar";
import TransactionCardView from "../components/TransactionCardView";
import TransactionTableView from "../components/TransactionTableView";
import { filterTransactionsBySearch } from "./filterTransactionsBySearch";
import { useTransactionPaymentModals } from "./useTransactionPaymentModals";
import { useTransactionPaymentResult } from "./useTransactionPaymentResult";
import {
  transactionFilterToApiType,
  type TransactionFilter,
  type TransactionView,
} from "../transactionMethodMeta";

const TransactionNestedPages = () => {
  const searchParams = useSearchParams();
  const companyId = useWorkspaceCompanyId();

  const getTx_ref = searchParams.get("tx_ref");
  const getSuccessInstance = searchParams.get("success_instance");
  const getErrorInstance = searchParams.get("error_instance");

  const { removeAllItemsFromCart } = useCart();

  const [selectedHistoryTableFilterValue, setSelectedHistoryTableFilterValue] =
    useState<TransactionFilter>("all");
  const [view, setView] = useState<TransactionView>("table");
  const [search, setSearch] = useState("");
  const { page, setPage } = useTablePageQuery();
  const perPage = 10;
  const selectedType = transactionFilterToApiType(
    selectedHistoryTableFilterValue,
  );

  const {
    data: verifyOrderPayment,
    isLoading: verifyOrder_loading,
    isError: verifyOrder_error,
  } = useVerifyOrderPaymentQuery(
    { companyId: companyId!, tx_ref: String(getTx_ref) },
    { skip: !companyId || !getTx_ref },
  );

  useTransactionPaymentResult({
    errorInstance: getErrorInstance,
    removeAllItemsFromCart,
    successInstance: getSuccessInstance,
    txRef: getTx_ref,
    verifyOrderError: verifyOrder_error,
    verifyOrderPayment,
  });

  const {
    data: getTransactions,
    isLoading: transaction_isLoading,
    isFetching: transaction_isFetching,
    isError: transaction_error,
  } = useGetTransactionsQuery(
    {
      companyId: companyId!,
      params: {
        type: selectedType,
        page,
        per_page: perPage,
      },
    },
    { skip: !companyId },
  );

  const transactionsData: unknown = getTransactions?.data?.data;

  const handleHistoryTableFilterValueChange = (value: TransactionFilter) => {
    setSelectedHistoryTableFilterValue(value);
  };

  const {
    handleClosePaymentErrorModal,
    handleClosePaymentSuccessModal,
    handleGotoOrder,
    isPaymentSuccessOpen,
    setIsPaymentSuccessOpen,
  } = useTransactionPaymentModals({
    companyId,
    page,
    perPage,
    selectedType,
  });

  useResetTablePage(setPage, selectedHistoryTableFilterValue, search);

  useEffect(() => {
    if (getSuccessInstance) {
      setIsPaymentSuccessOpen(true);
    }
  }, [getSuccessInstance, setIsPaymentSuccessOpen]);

  const filteredTransactions = filterTransactionsBySearch(
    transactionsData,
    search,
  );
  const currentPage = getTransactions?.data?.current_page ?? page;
  const lastPage = getTransactions?.data?.last_page ?? 1;

  return (
    <>
      {!verifyOrder_loading ? (
        <>
          <div className="flex flex-col gap-4">
            <TransactionToolbar
              search={search}
              filter={selectedHistoryTableFilterValue}
              view={view}
              onSearchChange={setSearch}
              onFilterChange={handleHistoryTableFilterValueChange}
              onViewChange={setView}
            />

            {transaction_isLoading || transaction_isFetching ? (
              <div className="grid place-content-center py-16">
                <Loader />
              </div>
            ) : (
              <TableListLocationProvider page={page}>
                {view === "card" ? (
                  <TransactionCardView
                    transactions={filteredTransactions}
                    query={search}
                  />
                ) : (
                  <TransactionTableView
                    transactions={filteredTransactions}
                    query={search}
                  />
                )}
              </TableListLocationProvider>
            )}

            {transaction_error && (
              <p className="text-sm text-error-600">
                Failed to load transactions. Please try again.
              </p>
            )}

            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={setPage}
            />
          </div>

          <PaymentSuccessInstanceModal
            isOpen={isPaymentSuccessOpen}
            onClose={handleClosePaymentSuccessModal}
            onProceed={handleGotoOrder}
            disabled={transaction_isLoading}
          />
          <PaymentErrorInstanceModal
            isOpen={!getErrorInstance ? false : true}
            onClose={handleClosePaymentErrorModal}
            disabled={transaction_isLoading}
          />
        </>
      ) : (
        <div className="grid place-content-center py-16">
          <Loader />
        </div>
      )}
    </>
  );
};

export default TransactionNestedPages;
