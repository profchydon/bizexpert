"use client";

import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import {
  CANCELLATION_REASONS,
  type CancellationReasonId,
} from "@/utils/order-cancellation";

interface Props {
  reasonId: CancellationReasonId | null;
  onReasonChange: (id: CancellationReasonId) => void;
  details: string;
  onDetailsChange: (value: string) => void;
}

const REASON_ITEMS = CANCELLATION_REASONS.map((reason) => ({
  id: reason.id,
  label: reason.label,
}));

export function CancelReasonSection({
  reasonId,
  onReasonChange,
  details,
  onDetailsChange,
}: Props) {
  const [showDetails, setShowDetails] = useState(details.length > 0);

  return (
    <div className="mt-4 flex flex-col gap-3">
      <Select
        label="Reason for cancelling"
        placeholder="Select a reason"
        size="md"
        isRequired
        selectedKey={reasonId}
        onSelectionChange={(key) =>
          key && onReasonChange(String(key) as CancellationReasonId)
        }
        items={REASON_ITEMS}
        data-testid="cancelreasonsection-select"
      >
        {(item) => <Select.Item key={item.id} {...item} />}
      </Select>
      {showDetails ? (
        <TextArea
          label="Additional details"
          placeholder="e.g., Employee no longer needs equipment due to role change"
          value={details}
          onChange={onDetailsChange}
          rows={2}
        />
      ) : (
        <div>
          <Button
            color="link-color"
            size="sm"
            iconLeading={Plus}
            onClick={() => setShowDetails(true)}
            data-testid="cancelreasonsection-button"
          >
            Add a note
          </Button>
        </div>
      )}
    </div>
  );
}
