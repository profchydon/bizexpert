"use client";

import { Button } from "@/components/ui/button";

interface Props {
  done: boolean;
  atLimit: boolean;
  isSaving: boolean;
  isUpgrading: boolean;
  upgradeLabel: string;
  onClose: () => void;
  onCreate: () => void;
  onUpgrade: () => void;
}

export function CreateOfficeFooter({
  done,
  atLimit,
  isSaving,
  isUpgrading,
  upgradeLabel,
  onClose,
  onCreate,
  onUpgrade,
}: Props) {
  if (done) {
    return (
      <Button onClick={onClose} data-testid="createofficefooter-button">
        Done
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        className="font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-700"
        onClick={onClose}
        data-testid="createofficefooter-button-2"
      >
        Cancel
      </Button>
      {atLimit ? (
        <Button
          isLoading={isUpgrading}
          onClick={onUpgrade}
          data-testid="createofficefooter-button-3"
        >
          {upgradeLabel}
        </Button>
      ) : (
        <Button
          onClick={onCreate}
          isLoading={isSaving}
          data-testid="createofficefooter-button-4"
        >
          Create office
        </Button>
      )}
    </>
  );
}
