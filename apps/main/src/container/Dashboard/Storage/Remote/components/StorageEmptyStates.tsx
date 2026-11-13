import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";

export function NoDevicesState({
  onImport,
  importLoading,
}: {
  onImport: () => void;
  importLoading?: boolean;
}) {
  return (
    <EmptyState size="lg" className="py-16">
      <EmptyState.Header pattern="none">
        <EmptyState.Illustration type="box" color="gray" />
      </EmptyState.Header>
      <EmptyState.Content>
        <EmptyState.Title>No devices in storage yet</EmptyState.Title>
        <EmptyState.Description>
          Devices appear here after an offboarding, or when you import existing
          inventory with Open Fleet.
        </EmptyState.Description>
      </EmptyState.Content>
      <EmptyState.Footer>
        <Button
          size="md"
          isLoading={importLoading}
          onClick={onImport}
          data-testid="storageemptystates-button"
        >
          Import devices with Open Fleet
        </Button>
      </EmptyState.Footer>
    </EmptyState>
  );
}

export function NoMatchesState({
  onClear,
  title = "No devices match these filters",
  description = "Try clearing a filter or searching a different serial number.",
}: {
  onClear: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState size="md" className="py-12">
      <EmptyState.Header pattern="none">
        <EmptyState.Illustration type="documents" color="gray" />
      </EmptyState.Header>
      <EmptyState.Content>
        <EmptyState.Title>{title}</EmptyState.Title>
        <EmptyState.Description>{description}</EmptyState.Description>
      </EmptyState.Content>
      <EmptyState.Footer>
        <Button
          size="md"
          color="secondary"
          onClick={onClear}
          data-testid="storageemptystates-button-2"
        >
          Clear all filters
        </Button>
      </EmptyState.Footer>
    </EmptyState>
  );
}

export function LoadErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState size="md" className="py-12">
      <EmptyState.Header pattern="none">
        <EmptyState.Illustration type="cloud" color="gray" />
      </EmptyState.Header>
      <EmptyState.Content>
        <EmptyState.Title>We couldn&apos;t load your storage</EmptyState.Title>
        <EmptyState.Description>
          Something went wrong on our end. Your devices are safe — this is just
          a display issue.
        </EmptyState.Description>
      </EmptyState.Content>
      <EmptyState.Footer>
        <Button
          size="md"
          onClick={onRetry}
          data-testid="storageemptystates-button-3"
        >
          Try again
        </Button>
      </EmptyState.Footer>
    </EmptyState>
  );
}
