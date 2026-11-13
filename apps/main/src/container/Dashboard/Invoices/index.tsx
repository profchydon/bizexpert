"use client";

import PageHeader from "@/components/PageHeader";
import InvoiceList from "./InvoiceList";

const Invoices = () => {
  return (
    <div className="flex flex-col gap-6 py-8">
      <PageHeader
        pageTitle="Invoices"
        pageDescription="All your invoices at a glance."
        breadCrumbs={["Invoices"]}
      />
      <InvoiceList />
    </div>
  );
};

export default Invoices;
