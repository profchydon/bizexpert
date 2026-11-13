import React from "react";
import {
  referenceNativeBodyCellClass,
  referenceNativeBodyRowClass,
} from "@/components/application/table/reference-table-classes";
import { Calendar } from "lucide-react";
import { Building02 } from "@untitledui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import CustomTooltip from "@/components/CustomTooltip";
import OrderStatusBadgeV2 from "../../../v2/components/OrderStatusBadgeV2";
import OrderSignatureBadgeV2 from "../../../v2/components/OrderSignatureBadgeV2";
import OrderActionTypeBadgeV2 from "./OrderActionTypeBadgeV2";
import OrderInfoRowMenu from "./OrderInfoRowMenu";
import { OrderInfoRowValues } from "./orderInfoRowValues";

interface Props {
  values: OrderInfoRowValues;
  showSelect: boolean;
  isSelectable: boolean;
  selectDisabledReason?: string | null;
  isSelected: boolean;
  onToggleSelect: (checked: boolean) => void;
  showAmount: boolean;
  showActionType: boolean;
  showWindow: boolean;
  onView: () => void;
  onVerify?: () => void;
  verifyLabel?: string;
  isVerifyDisabled?: boolean;
  verifyDisabledReason?: string | null;
  onCancelSubOrder?: () => void;
}

const cellClass = referenceNativeBodyCellClass;

const OrderInfoRowV2: React.FC<Props> = ({
  values,
  showSelect,
  isSelectable,
  selectDisabledReason,
  isSelected,
  onToggleSelect,
  showAmount,
  showActionType,
  showWindow,
  onView,
  onVerify,
  verifyLabel,
  isVerifyDisabled,
  verifyDisabledReason,
  onCancelSubOrder,
}) => (
  <tr className={referenceNativeBodyRowClass}>
    {showSelect && (
      <td className="w-px px-6 py-4 align-middle">
        {!isSelectable && selectDisabledReason ? (
          <CustomTooltip content={selectDisabledReason}>
            <span className="inline-flex">
              <Checkbox
                checked={isSelected}
                disabled
                aria-label="Select row"
                className="pointer-events-none"
                data-testid="orderinforowv2-checkbox"
              />
            </span>
          </CustomTooltip>
        ) : (
          <span className="inline-flex">
            <Checkbox
              checked={isSelected}
              disabled={!isSelectable}
              onCheckedChange={(value) => onToggleSelect(!!value)}
              aria-label="Select row"
              data-testid="orderinforowv2-checkbox-2"
            />
          </span>
        )}
      </td>
    )}
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
          {values.isOffice ? (
            <Building02
              className="size-5 text-gray-600"
              aria-label="Office"
              data-testid="orderinforowv2-office-icon"
            />
          ) : (
            values.initials
          )}
        </span>
        <div className="min-w-0">
          <button
            type="button"
            onClick={onView}
            className="block max-w-full truncate text-left text-sm font-medium whitespace-nowrap text-primary-700 underline underline-offset-2 hover:text-primary-800"
          >
            {values.name}
          </button>
          {values.role && (
            <p className="truncate text-sm text-gray-500">{values.role}</p>
          )}
        </div>
      </div>
    </td>
    <td className={`${cellClass} max-w-[200px]`}>
      <span className="line-clamp-2">{values.address || "—"}</span>
    </td>
    {showAmount && (
      <td className={`${cellClass} whitespace-nowrap`}>{values.amount}</td>
    )}
    {showActionType && (
      <td className="px-6 py-4">
        <OrderActionTypeBadgeV2 type={values.actionType} />
      </td>
    )}
    <td className="px-6 py-4">
      <OrderStatusBadgeV2 status={values.status} />
    </td>
    <td className="px-6 py-4">
      <OrderSignatureBadgeV2
        signatureRequested={values.signatureRequested}
        signatureStatus={values.signatureStatus}
      />
    </td>
    {showWindow && (
      <td className={`${cellClass} whitespace-nowrap`}>
        {values.window ? (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0 text-gray-400" />
            {values.window}
          </span>
        ) : (
          <span className="text-gray-400">Not set</span>
        )}
      </td>
    )}
    <td className="py-4 pr-6 pl-4 text-right">
      <OrderInfoRowMenu
        onView={onView}
        onVerify={onVerify}
        verifyLabel={verifyLabel}
        isVerifyDisabled={isVerifyDisabled}
        verifyDisabledReason={verifyDisabledReason}
        onCancelSubOrder={onCancelSubOrder}
      />
    </td>
  </tr>
);

export default OrderInfoRowV2;
