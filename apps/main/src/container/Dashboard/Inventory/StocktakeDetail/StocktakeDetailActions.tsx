"use client";

import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  isPending: boolean;
  saveLoading: boolean;
  submitLoading: boolean;
  approveLoading: boolean;
  rejectLoading: boolean;
  onSave: () => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export function StocktakeDetailActions({
  isOpen,
  isPending,
  saveLoading,
  submitLoading,
  approveLoading,
  rejectLoading,
  onSave,
  onSubmit,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {isOpen ? (
        <>
          <Button
            variant="outline"
            size="md"
            isLoading={saveLoading}
            onClick={onSave}
          >
            Save counts
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={submitLoading}
            onClick={onSubmit}
          >
            Submit for approval
          </Button>
        </>
      ) : null}
      {isPending ? (
        <>
          <Button
            variant="outline"
            size="md"
            isLoading={rejectLoading}
            onClick={onReject}
          >
            Reject
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={approveLoading}
            onClick={onApprove}
          >
            Approve and post
          </Button>
        </>
      ) : null}
    </div>
  );
}
