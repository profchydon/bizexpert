"use client";

import { Button } from "@/components/ui/button";

type Props = {
  formId: string;
  isDisconnecting: boolean;
  isUpdating: boolean;
  onDisconnect: () => void;
};

export function HrisConnectedFooter({
  formId,
  isDisconnecting,
  isUpdating,
  onDisconnect,
}: Readonly<Props>) {
  return (
    <div
      className="w-full shrink-0 border-t border-border-secondary bg-primary px-6 py-4"
      data-testid="hris-connected-footer"
    >
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          className="text-sm font-semibold text-error-600 border-error-600 hover:bg-error-50"
          variant="outline"
          onClick={onDisconnect}
          disabled={isDisconnecting}
          data-testid="hrisconnectedfooter-button"
        >
          Disconnect
        </Button>
        <Button
          type="submit"
          form={formId}
          disabled={isUpdating}
          className="text-sm font-semibold"
          variant="outline"
          data-testid="hrisconnectedfooter-button-2"
        >
          {isUpdating ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
