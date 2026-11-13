"use client";

import { Package, SwitchHorizontal01, Trash01 } from "@untitledui/icons";
import { Loader2 } from "lucide-react";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import type { Disposition } from "@/types/offboard";

type Props = {
  onReassign: () => void;
  onStore: () => void;
  onDispose: () => void;
  pendingDisposition?: Disposition | null;
};

const menuSpinner = (
  <Loader2
    aria-hidden="true"
    className="size-4 shrink-0 animate-spin text-fg-quaternary"
  />
);

const EmployeeEquipmentRowActions = ({
  onReassign,
  onStore,
  onDispose,
  pendingDisposition = null,
}: Props) => {
  const isBusy = Boolean(pendingDisposition);

  return (
    <div className="flex justify-end">
      <Dropdown.Root>
        <Dropdown.DotsButton isDisabled={isBusy} />
        <Dropdown.Popover className="w-52">
          <Dropdown.Menu selectionMode="none">
            <Dropdown.Item
              icon={
                pendingDisposition === "REASSIGN"
                  ? undefined
                  : SwitchHorizontal01
              }
              leading={
                pendingDisposition === "REASSIGN" ? menuSpinner : undefined
              }
              label="Reassign equipment"
              isDisabled={isBusy && pendingDisposition !== "REASSIGN"}
              onAction={onReassign}
            />
            <Dropdown.Item
              icon={pendingDisposition === "STORE" ? undefined : Package}
              leading={pendingDisposition === "STORE" ? menuSpinner : undefined}
              label="Store equipment"
              isDisabled={isBusy && pendingDisposition !== "STORE"}
              onAction={onStore}
            />
            <Dropdown.Item
              icon={pendingDisposition === "DISPOSE" ? undefined : Trash01}
              leading={
                pendingDisposition === "DISPOSE" ? menuSpinner : undefined
              }
              label="Dispose equipment"
              isDisabled={isBusy && pendingDisposition !== "DISPOSE"}
              onAction={onDispose}
            />
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Root>
    </div>
  );
};

export default EmployeeEquipmentRowActions;
