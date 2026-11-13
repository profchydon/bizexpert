"use client";

import { Eye, ShieldTick, SlashCircle01 } from "@untitledui/icons";
import { Dropdown } from "@/components/base/dropdown/dropdown";

interface Props {
  onView: () => void;
  onVerify?: () => void;
  verifyLabel?: string;
  isVerifyDisabled?: boolean;
  verifyDisabledReason?: string | null;
  onCancelSubOrder?: () => void;
}

const OrderInfoRowMenu: React.FC<Props> = ({
  onView,
  onVerify,
  verifyLabel = "Verify address",
  isVerifyDisabled,
  verifyDisabledReason,
  onCancelSubOrder,
}) => (
  <div className="flex justify-end">
    <Dropdown.Root>
      <Dropdown.DotsButton data-testid="orderinforowmenu-button" />
      <Dropdown.Popover className="w-56">
        <Dropdown.Menu selectionMode="none">
          <Dropdown.Item id="view" icon={Eye} label="View" onAction={onView} />
          {onVerify && (
            <Dropdown.Item
              id="verify"
              icon={ShieldTick}
              label={verifyLabel}
              isDisabled={isVerifyDisabled}
              disabledReason={verifyDisabledReason}
              onAction={isVerifyDisabled ? undefined : onVerify}
            />
          )}
          {onCancelSubOrder && (
            <Dropdown.Item
              id="cancelSubOrder"
              icon={SlashCircle01}
              label="Cancel sub-order"
              onAction={onCancelSubOrder}
            />
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  </div>
);

export default OrderInfoRowMenu;
