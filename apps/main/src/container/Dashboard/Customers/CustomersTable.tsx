"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Customer } from "@/types/bizexpert";
import { CustomerFormSlideout } from "./CustomerFormSlideout";
import { customersTableColumns } from "./customerColumns";
import { DeleteCustomerModal } from "./DeleteCustomerModal";
import { filterCustomersBySearch } from "./filterCustomersBySearch";
import { readCustomersApiError } from "./customersApiError";
import {
  customersTableCountBadgeClass,
  customersTableShellClass,
  customersTableTitleClass,
  customersTableToolbarClass,
} from "./customersPageClasses";
import { customersQueryKeys } from "./customersQueryKeys";
import { CustomersTableActions } from "./tableActions";

type Props = {
  onCreate: () => void;
};

export function CustomersTable({ onCreate }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const { push, isPending } = useTransitionRouter();
  const [search, setSearch] = useState("");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: customersQueryKeys.list(businessId ?? ""),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/customers`);
      return res.data as Customer[];
    },
  });

  const removeCustomer = useMutation({
    mutationFn: async (customerId: string) => {
      await bizexpertApi.delete(
        `/businesses/${businessId}/customers/${customerId}`,
      );
    },
    onSuccess: async () => {
      toast.success("Customer deleted");
      setDeleteCustomer(null);
      await qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (err) => toast.error(readCustomersApiError(err, "Delete failed")),
  });

  const rows = useMemo(
    () => filterCustomersBySearch(data ?? [], search),
    [data, search],
  );

  const columns = useMemo(
    () =>
      customersTableColumns({
        renderActions: (item) => (
          <CustomersTableActions
            isNavigating={isPending && activeId === item.id}
            onView={() => {
              setActiveId(item.id);
              push(`/dashboard/customers/${item.id}`);
            }}
            onEdit={() => setEditCustomer(item)}
            onDelete={() => setDeleteCustomer(item)}
          />
        ),
      }),
    [activeId, isPending, push],
  );

  return (
    <div className="space-y-4">
      <div className={customersTableShellClass}>
        <div className={customersTableToolbarClass}>
          <h3 className={customersTableTitleClass}>
            Customers
            {!isLoading && rows.length > 0 ? (
              <span className={customersTableCountBadgeClass}>
                {rows.length}
              </span>
            ) : null}
          </h3>
          <SearchWithIcon
            className="w-[310px]"
            placeholder="Search by name, phone, or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <PageState isLoading={isLoading} isError={isError}>
          <DataTable
            data={rows}
            columns={columns}
            paginationClassName={referenceTablePaginationClass}
          >
            <EmptyTableInstance
              title="No customers yet"
              description="Add customers to track sales, credit, and store wallet."
              buttonText="Add customer"
              onButtonClick={onCreate}
            />
          </DataTable>
        </PageState>
      </div>
      <CustomerFormSlideout
        isOpen={Boolean(editCustomer)}
        customer={editCustomer}
        onClose={() => setEditCustomer(null)}
      />
      {deleteCustomer ? (
        <DeleteCustomerModal
          isOpen
          customer={deleteCustomer}
          isDeleting={removeCustomer.isPending}
          onClose={() => setDeleteCustomer(null)}
          onConfirm={() => removeCustomer.mutate(deleteCustomer.id)}
        />
      ) : null}
    </div>
  );
}
