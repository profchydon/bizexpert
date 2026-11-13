import { useState } from "react";
import { Trash01 } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cn } from "@/lib/utils";
import InactiveCell from "./InactiveCell";
import { AssignmentUnit, EmployeeOption } from "./types";
import DestinationPicker from "./DestinationPicker";
import DestinationMeta from "./DestinationMeta";
import OfficeContactPicker from "./OfficeContactPicker";
import { earliestArrivalFor } from "./earliestArrival";
import type { Office } from "@/container/Dashboard/Accounts/types";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import type { AssignmentDestination, ContactSource } from "./types";
import { Badge } from "@/components/base/badges/badges";
import formatAmount from "@/utils/formatAmount";
import { cartItemUnitAmount } from "@/utils/cartItemSource";
import CrossCountryWarning from "./CrossCountryWarning";
import DuplicateWarning from "./DuplicateWarning";
import Image from "next/image";
import { product_1 } from "@/assets/images";
import { getCartCountry } from "./cartCountry";
import { readCartCountryMap } from "@/hooks/cartCountryMemory";
import { BadgeColors } from "@/components/base/badges/badge-types";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { formatDeliveryEstimate } from "../Marketplace/utils/formatDeliveryEstimate";
import { DatePicker } from "@/components/ui/date-picker";
import dayjs from "dayjs";
import SetupPicker from "./SetupPicker";
import { setupOptionsFor } from "./deviceSetup";
import { useConfigurableTypeIds } from "./useConfigurableTypeIds";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import {
  ASSIGN_ROW_COLS,
  ASSIGN_ROW_GRID,
  ASSIGN_ROW_PX,
} from "./assignRowLayout";
import { unitRowId } from "./destinationSummary";
import { conditionTooltip, destinationRail } from "./deviceRowStyle";

interface DeviceRowProps {
  unit: AssignmentUnit;
  employees: EmployeeOption[];
  offices: Office[];
  contacts: Record<
    string,
    { contactEmployeeId: string; contactEmployeeName: string }
  >;
  officeContacts: Record<string, OfficeDeliveryContact[]>;
  isLast: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAssignDestination: (destination: AssignmentDestination) => void;
  onAssignEmployee: (employeeId: string, employeeName: string) => void;
  onAssignStorage: () => void;
  onSetOfficeContact?: (
    contactEmployeeId: string,
    contactEmployeeName: string,
    source: ContactSource,
  ) => void;
  onAddEmployeeAction: () => void;
  fulfilmentDate?: string;
  onSetFulfilmentDate: (employeeId: string, fulfilmentDate: string) => void;
  deviceSetup?: string;
  onSetDeviceSetup: (unitId: string, deviceSetup: string) => void;
  isDuplicate: boolean;
  crossCountry?: {
    deviceCountry: string;
    employeeCountry: string;
  };
  onRemove: () => void;
}

const DeviceRow: React.FC<DeviceRowProps> = ({
  unit,
  employees,
  offices,
  contacts,
  officeContacts,
  isLast,
  isSelected,
  onToggleSelect,
  onAssignDestination,
  onAssignEmployee: _onAssignEmployee,
  onAssignStorage: _onAssignStorage,
  onSetOfficeContact,
  onAddEmployeeAction,
  fulfilmentDate,
  onSetFulfilmentDate,
  deviceSetup,
  onSetDeviceSetup,
  isDuplicate,
  crossCountry,
  onRemove,
}) => {
  const currencySymbol = useWorkspaceCurrencySymbol();
  const configurableTypes = useConfigurableTypeIds();

  const selectedId =
    unit.destination.type === "employee"
      ? unit.destination.employeeId
      : unit.destination.type === "office"
        ? unit.destination.officeId
        : "";
  const isStorage = unit.destination.type === "storage";
  const isOffice = unit.destination.type === "office";
  const isFulfilmentDateDisabled = unit.destination.type === "unassigned";
  const datePlaceholder = "Pick a date";
  const [isChangingContact, setIsChangingContact] = useState(false);
  const cartCountry = getCartCountry(unit.cartItem);
  const { data: countriesResponse } = useGetCountriesQuery();
  const countries =
    (countriesResponse?.data?.data as
      | Array<{
          id?: string;
          name?: string;
          code?: string;
          eta?: string | null;
        }>
      | undefined) ?? [];
  const normalizeSpecKey = (value?: string) =>
    value?.toLowerCase().split(/\s+/).join("_").split("-").join("_");

  const findConditionValue = (
    specs?: Array<{ name?: string; value?: string }>,
  ) =>
    specs?.find((spec) => {
      const normalizedName = normalizeSpecKey(spec?.name);
      return (
        normalizedName === "condition" || normalizedName === "spec_condition"
      );
    })?.value;

  const normalizedSpecCondition = findConditionValue(
    unit.cartItem.specification?.properties,
  );

  const normalizedSpecificationCondition = findConditionValue(
    unit.cartItem.specification?.spec,
  );

  const normalizedAssetSpecCondition = unit.cartItem.asset?.spec?.find(
    (spec) => {
      const normalizedName = spec?.name
        ?.toLowerCase()
        .split(/\s+/)
        .join("_")
        .split("-")
        .join("_");

      return (
        normalizedName === "condition" || normalizedName === "spec_condition"
      );
    },
  )?.value;

  const badgeLabel =
    normalizedSpecCondition ||
    normalizedSpecificationCondition ||
    normalizedAssetSpecCondition ||
    (unit.cartItem.asset as any)?.spec_condition ||
    (unit.cartItem.asset as any)?.condition ||
    (unit.cartItem.asset as any)?.state ||
    unit.cartItem.asset?.status ||
    "Brand New";
  const image =
    (Array.isArray(unit.cartItem.images)
      ? unit.cartItem.images[0]
      : unit.cartItem.images) ||
    unit.cartItem.asset?.images?.[0] ||
    product_1;

  const getBadgeColor = (): BadgeColors => {
    const value = badgeLabel.toLowerCase();
    if (value.includes("refurb")) return "purple";
    if (value.includes("used")) return "warning";
    return "brand";
  };
  const rail = destinationRail(unit.destination);

  const remembered = readCartCountryMap()[unit.cartItem.pricing.id];
  const extendedCartItem = unit.cartItem as typeof unit.cartItem & {
    country?: { id?: string; name?: string; label?: string };
  };

  const matchedCountryEta = countries.find((item) => {
    if (
      extendedCartItem?.country?.id &&
      item?.id === extendedCartItem.country.id
    ) {
      return true;
    }

    if (
      cartCountry.code &&
      item?.code?.toUpperCase() === cartCountry.code.toUpperCase()
    ) {
      return true;
    }

    const normalizedItemName = (item?.name || "").trim().toLowerCase();
    const normalizedLabel = (cartCountry.label || "").trim().toLowerCase();
    const normalizedName = (extendedCartItem?.country?.name || "")
      .trim()
      .toLowerCase();

    return (
      normalizedItemName === normalizedLabel ||
      normalizedItemName === normalizedName
    );
  })?.eta;

  const deliveryLine = unit.cartItem.storageDuration
    ? unit.cartItem.storageDuration
    : formatDeliveryEstimate(matchedCountryEta || remembered?.eta);
  const displayAmount = cartItemUnitAmount(unit.cartItem);

  const minimumFulfilmentDate = (() => {
    const floor = earliestArrivalFor(
      matchedCountryEta || remembered?.eta || deliveryLine,
    );
    return floor ? new Date(`${floor}T00:00:00`) : undefined;
  })();
  const parsedFulfilmentDate = fulfilmentDate
    ? dayjs(fulfilmentDate).toDate()
    : undefined;

  const deviceName = unit.cartItem.asset?.name || "device";
  const setupOptions = setupOptionsFor(
    unit.cartItem.asset ?? {},
    configurableTypes,
  );

  return (
    <div
      className={cn(
        "relative transition-colors hover:bg-secondary",
        !isLast && "border-b border-secondary",
      )}
    >
      {rail && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full duration-300 animate-in fade-in motion-reduce:animate-none",
            rail,
          )}
        />
      )}

      <div
        id={unitRowId(unit.unitId)}
        className={cn(
          ASSIGN_ROW_GRID,
          ASSIGN_ROW_PX,
          "scroll-mt-40 py-3.5 ring-brand-500 transition-shadow duration-500 data-[revealed=true]:ring-2",
        )}
        style={{ gridTemplateColumns: ASSIGN_ROW_COLS }}
      >
        <Checkbox
          size="sm"
          isSelected={isSelected}
          onChange={onToggleSelect}
          aria-label={`Select ${deviceName}`}
          data-testid="devicerow-checkbox"
        />

        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-tertiary">
            <Image
              src={image}
              alt={deviceName}
              width={36}
              height={36}
              className="size-9 object-contain"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-sm font-semibold text-primary">
              {unit.cartItem.asset?.name}
            </p>
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <Tooltip title={conditionTooltip(badgeLabel)} placement="top">
                <TooltipTrigger className="cursor-default">
                  <Badge type="pill-color" size="sm" color={getBadgeColor()}>
                    {badgeLabel}
                  </Badge>
                </TooltipTrigger>
              </Tooltip>
              <span className="truncate text-xs text-tertiary">
                {unit.cartItem.storageDuration
                  ? deliveryLine
                  : `Arrives in ${deliveryLine || "an unconfirmed time"}`}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          {isChangingContact &&
          isOffice &&
          unit.destination.type === "office" ? (
            <OfficeContactPicker
              contacts={officeContacts[unit.destination.officeId] ?? []}
              contactEmployeeId={unit.destination.contactEmployeeId}
              officeDefault={contacts[unit.destination.officeId]}
              onSelect={(contact) => {
                onSetOfficeContact?.(
                  contact.contactEmployeeId,
                  contact.contactEmployeeName,
                  unit.destination.type === "office" &&
                    contacts[unit.destination.officeId]?.contactEmployeeId ===
                      contact.contactEmployeeId
                    ? "office-default"
                    : "row",
                );
                setIsChangingContact(false);
              }}
            />
          ) : (
            <DestinationPicker
              destination={unit.destination}
              employees={employees}
              offices={offices}
              contacts={contacts}
              countryLabel={cartCountry.label}
              countryCode={cartCountry.code}
              ariaLabel={`Send ${unit.cartItem.asset?.name || "item"} to`}
              isWarning={Boolean(crossCountry)}
              onAssign={onAssignDestination}
              onAddEmployeeAction={onAddEmployeeAction}
            />
          )}
        </div>

        {setupOptions.length > 0 ? (
          <SetupPicker
            options={setupOptions}
            value={deviceSetup}
            ariaLabel={`Setup for ${deviceName}`}
            onChange={(value) => onSetDeviceSetup(unit.unitId, value)}
          />
        ) : (
          <InactiveCell
            label="Not applicable"
            tooltip="This device cannot be enrolled in a mobile device manager."
          />
        )}

        {isStorage ? (
          <InactiveCell
            label="Not applicable"
            tooltip="Nothing is being delivered to anyone. The device waits in the warehouse until you deploy it."
          />
        ) : (
          <DatePicker
            className="h-9 w-full"
            date={parsedFulfilmentDate as Date}
            placeHolder={datePlaceholder}
            disablePastDates
            minDate={minimumFulfilmentDate}
            disabled={isFulfilmentDateDisabled}
            setDate={(value) => {
              if (unit.destination.type === "unassigned") {
                return;
              }

              const dateKey =
                unit.destination.type === "employee"
                  ? unit.destination.employeeId
                  : unit.unitId;
              onSetFulfilmentDate(dateKey, dayjs(value).format("YYYY-MM-DD"));
            }}
          />
        )}

        <span className="text-right text-[15px] font-semibold tabular-nums text-primary">
          {currencySymbol}
          {formatAmount(displayAmount)}
        </span>

        <div className="flex justify-end">
          <ButtonUtility
            size="sm"
            color="tertiary"
            icon={Trash01}
            tooltip={`Remove ${deviceName} from this order`}
            onClick={onRemove}
            className="hover:text-fg-error-primary"
            data-testid="devicerow-remove"
          />
        </div>

        <div className="col-start-3 -mt-1.5 min-w-0 empty:hidden">
          <DestinationMeta
            destination={unit.destination}
            contactSource={unit.contactSource}
            isOfficeAdmin={
              unit.destination.type === "office"
                ? officeContacts[unit.destination.officeId]?.find(
                    (contact) =>
                      unit.destination.type === "office" &&
                      contact.id === unit.destination.contactEmployeeId,
                  )?.is_office_admin
                : false
            }
            deviceCountry={cartCountry.label}
            isCrossBorder={Boolean(crossCountry)}
            onChangeContact={
              isOffice ? () => setIsChangingContact(true) : undefined
            }
          />
        </div>
      </div>

      <div className={cn(ASSIGN_ROW_PX, "pb-1")}>
        {isDuplicate && unit.destination.type === "employee" && (
          <DuplicateWarning
            employeeName={unit.destination.employeeName}
            deviceName={unit.cartItem.asset?.name || "device"}
          />
        )}

        {crossCountry && (
          <CrossCountryWarning
            deviceCountry={crossCountry.deviceCountry}
            employeeCountry={crossCountry.employeeCountry}
          />
        )}
      </div>
    </div>
  );
};

export default DeviceRow;
