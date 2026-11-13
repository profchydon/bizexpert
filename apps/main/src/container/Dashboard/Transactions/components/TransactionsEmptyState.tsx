import { SearchLg } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";

export function TransactionsEmptyState({ query }: { query: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl bg-primary px-6 py-16 ring-1 ring-secondary">
      <EmptyState size="md">
        <EmptyState.Header>
          <EmptyState.FeaturedIcon icon={SearchLg} color="gray" />
        </EmptyState.Header>
        <EmptyState.Content>
          <EmptyState.Title>No transactions found</EmptyState.Title>
          <EmptyState.Description>
            {query
              ? `We couldn't find anything matching "${query}". Try a different reference, amount or order number.`
              : "Adjust your filters to see results."}
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState>
    </div>
  );
}
