"use client";

import { Eye } from "@untitledui/icons";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { ACTION_META, availableActions } from "../data/deviceActions";
import type { RequestKind, StoredDevice } from "../types/storage";

interface Props {
  device: StoredDevice;
  onOpen: (device: StoredDevice) => void;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
}

export function StorageRowActions({ device, onOpen, onAction }: Props) {
  const actions = availableActions(device);

  return (
    <Dropdown.Root>
      <Dropdown.DotsButton />
      <Dropdown.Popover className="w-52">
        <Dropdown.Menu>
          <Dropdown.Item
            id="view"
            icon={Eye}
            label="View"
            onAction={() => onOpen(device)}
          />
          {actions.map((kind) => {
            const meta = ACTION_META[kind];
            return (
              <Dropdown.Item
                key={kind}
                id={kind}
                icon={meta.icon}
                label={meta.label}
                onAction={() => onAction(kind, device)}
              />
            );
          })}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
}
