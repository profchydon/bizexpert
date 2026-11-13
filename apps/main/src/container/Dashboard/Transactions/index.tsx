"use client";
import React from "react";
import TransactionNestedPages from "./TransactionNestedPages";
import PageHeader from "@/components/PageHeader";

const Transactions = () => {
  return (
    <div className="flex flex-col gap-6 py-8">
      <PageHeader
        pageTitle="Transactions report"
        pageDescription="All your transactions information at a glance."
        breadCrumbs={["Transactions report"]}
      />
      <TransactionNestedPages />
    </div>
  );
};

export default Transactions;
