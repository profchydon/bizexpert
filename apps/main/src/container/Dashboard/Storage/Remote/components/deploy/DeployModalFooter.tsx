"use client";

import { Button } from "@/components/base/buttons/button";

interface Props {
  canConfirm: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeployModalFooter({
  canConfirm,
  isLoading = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <footer className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
      <Button
        size="md"
        color="secondary"
        isDisabled={isLoading}
        onClick={onClose}
        data-testid="deploymodalfooter-button"
      >
        Cancel
      </Button>
      <Button
        size="md"
        isDisabled={!canConfirm || isLoading}
        isLoading={isLoading}
        onClick={onConfirm}
        data-testid="deploymodalfooter-button-2"
      >
        Confirm deployment
      </Button>
    </footer>
  );
}
