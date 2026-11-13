"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import PageState from "@/components/PageState";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Customer, CustomerLedgerType } from "@/types/bizexpert";
import { CustomerFormSlideout } from "../CustomerFormSlideout";
import {
  customersPageSectionClass,
  customersTableShellClass,
} from "../customersPageClasses";
import { customersQueryKeys } from "../customersQueryKeys";
import { CustomerLedgerSlideout } from "./CustomerLedgerSlideout";
import { CustomerStats } from "./CustomerStats";
import { customerLedgerColumns } from "./ledgerColumns";
import { customerSaleColumns } from "./saleColumns";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { businessId } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [ledgerType, setLedgerType] = useState<CustomerLedgerType | null>(null);

  const {
    data: customer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: customersQueryKeys.detail(businessId ?? "", id),
    enabled: !!businessId && !!id,
    queryFn: async () =>
      (await bizexpertApi.get(`/businesses/${businessId}/customers/${id}`))
        .data as Customer,
  });

  if (!businessId) {
    return <p className="py-8 text-secondary">No business selected.</p>;
  }

  return (
    <section className={customersPageSectionClass}>
      <PageHeader
        pageTitle={customer?.name ?? "Customer"}
        pageDescription={
          customer?.phone || customer?.email
            ? [customer.phone, customer.email].filter(Boolean).join(" · ")
            : "Customer account"
        }
        breadCrumbs={["Customers", customer?.name ?? "Customer"]}
      >
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            isLoading={isPending}
            onClick={() => push("/dashboard/customers")}
          >
            Back
          </Button>
          <Button variant="outline" size="md" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setLedgerType("wallet_credit")}
          >
            Update account
          </Button>
        </div>
      </PageHeader>
      <PageState isLoading={isLoading} isError={isError}>
        {customer ? (
          <div className="space-y-6">
            {customer.address ? (
              <p className="text-sm text-gray-600">{customer.address}</p>
            ) : null}
            <CustomerStats customer={customer} />
            <div className={customersTableShellClass}>
              <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
                Sales
              </h3>
              <DataTable
                data={customer.sales ?? []}
                columns={customerSaleColumns()}
              />
            </div>
            <div className={customersTableShellClass}>
              <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
                Account history
              </h3>
              <DataTable
                data={customer.ledger ?? []}
                columns={customerLedgerColumns()}
              />
            </div>
          </div>
        ) : null}
      </PageState>
      <CustomerFormSlideout
        isOpen={editOpen}
        customer={customer}
        onClose={() => setEditOpen(false)}
      />
      {customer && ledgerType ? (
        <CustomerLedgerSlideout
          isOpen
          customer={customer}
          defaultType={ledgerType}
          onClose={() => setLedgerType(null)}
        />
      ) : null}
    </section>
  );
}
