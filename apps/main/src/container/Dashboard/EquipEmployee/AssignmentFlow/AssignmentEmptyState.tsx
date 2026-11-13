import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";

interface AssignmentEmptyStateProps {
  onBrowse: () => void;
}

const AssignmentEmptyState: React.FC<AssignmentEmptyStateProps> = ({
  onBrowse,
}) => {
  return (
    <EmptyState className="py-16">
      <EmptyState.Header pattern="none">
        <EmptyState.Illustration type="box" color="gray" />
      </EmptyState.Header>
      <EmptyState.Content>
        <EmptyState.Title as="h2">Nothing left to assign</EmptyState.Title>
        <EmptyState.Description>
          You took every device out of this order. Pick some in the marketplace
          and they will show up here.
        </EmptyState.Description>
      </EmptyState.Content>
      <EmptyState.Footer>
        <Button
          size="md"
          color="primary"
          onClick={onBrowse}
          data-testid="assignmentemptystate-button"
        >
          Browse the marketplace
        </Button>
      </EmptyState.Footer>
    </EmptyState>
  );
};

export default AssignmentEmptyState;
