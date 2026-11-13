import { SearchLg } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import type { InvoiceFilter } from "./invoiceFilterMeta";

const emptyCopy: Record<InvoiceFilter, { title: string; description: string }> =
  {
    all: {
      title: "No invoices found",
      description: "Invoices created from checkout will appear here.",
    },
    unpaid: {
      title: "No unpaid invoices",
      description: "There are no unpaid invoices for this company.",
    },
    paid: {
      title: "No paid invoices",
      description: "Paid invoices will appear here once they are settled.",
    },
  };

export function InvoicesEmptyState({
  query,
  filter,
}: {
  query: string;
  filter: InvoiceFilter;
}) {
  const copy = query
    ? {
        title: "No invoices found",
        description: `We couldn't find anything matching "${query}". Try a different invoice number, reference, or amount.`,
      }
    : emptyCopy[filter];

  return (
    <div className="flex items-center justify-center rounded-xl bg-primary px-6 py-16 ring-1 ring-secondary">
      <EmptyState size="md">
        <EmptyState.Header>
          <EmptyState.FeaturedIcon icon={SearchLg} color="gray" />
        </EmptyState.Header>
        <EmptyState.Content>
          <EmptyState.Title>{copy.title}</EmptyState.Title>
          <EmptyState.Description>{copy.description}</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState>
    </div>
  );
}
