import type { Key } from "react";
import { Select } from "@/components/base/select/select";
import type { SetupOption } from "./deviceSetup";
import { setupPickerItems, setupValueFromSelection } from "./setupPickerItems";

interface SetupPickerProps {
  options: SetupOption[];
  value?: string;
  ariaLabel: string;
  placeholder?: string;
  isDisabled?: boolean;
  onChange: (value: string) => void;
}

const SetupPicker: React.FC<SetupPickerProps> = ({
  options,
  value,
  ariaLabel,
  placeholder = "Config request",
  isDisabled,
  onChange,
}) => {
  const items = setupPickerItems(options);

  return (
    <div className="flex w-full min-w-0 flex-col [&_p]:!leading-5">
      <Select
        size="sm"
        aria-label={ariaLabel}
        placeholder={placeholder}
        selectedKey={value || null}
        isDisabled={isDisabled}
        onSelectionChange={(key: Key | null) => {
          onChange(setupValueFromSelection(key == null ? null : String(key)));
        }}
        items={items}
        popoverClassName="min-w-[220px]"
        data-testid="setuppicker-select"
      >
        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
      </Select>
    </div>
  );
};

export default SetupPicker;
