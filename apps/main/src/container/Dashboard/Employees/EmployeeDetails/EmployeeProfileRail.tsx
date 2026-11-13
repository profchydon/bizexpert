"use client";

import type { ReactNode } from "react";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import CustomTooltip from "@/components/CustomTooltip";
import { getInitials } from "@/utils/getInitials";
import { useOfficeDetailHref } from "@/hooks/useOfficeDetailHref";
import type { IEmployees } from "@/types/employees";
import { buildPrimaryProfileFields } from "./employeeProfileFields";
import {
  employeeDetailCardClass,
  employeeDetailProfileRailClass,
} from "./employeeDetailClasses";

type Props = {
  employee?: IEmployees;
  isSelfOffboarding: boolean;
  isOffboardPending: boolean;
  showOffboardAction: boolean;
  onEditProfile: () => void;
  onOffboard: () => void;
  onOpenOtherDetails: () => void;
};

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-tertiary">{label}</span>
      <span className="text-sm font-medium break-words text-primary">
        {children}
      </span>
    </div>
  );
}

const EmployeeProfileRail = ({
  employee,
  isSelfOffboarding,
  isOffboardPending,
  showOffboardAction,
  onEditProfile,
  onOffboard,
  onOpenOtherDetails,
}: Props) => {
  const employeeStatus = employee?.status?.toLowerCase();
  const isActive = employeeStatus === "active";
  const officeHref = useOfficeDetailHref(
    employee?.office_id ?? employee?.office?.id,
  );
  const primaryFields = buildPrimaryProfileFields(employee, officeHref);

  const offboardButton = (
    <Button
      size="sm"
      color="secondary"
      className="flex-1"
      isDisabled={isSelfOffboarding || isOffboardPending}
      isLoading={isOffboardPending}
      onClick={onOffboard}
      data-testid="employeeprofilerail-button"
    >
      Off-board employee
    </Button>
  );

  return (
    <aside className={employeeDetailProfileRailClass}>
      <div className={employeeDetailCardClass}>
        <div className="h-24 bg-gray-100" />
        <div className="flex flex-col gap-5 px-5 pb-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <div className="-mt-12 flex size-24 items-center justify-center rounded-full bg-tertiary text-display-sm font-semibold text-quaternary shadow-lg outline-4 outline-bg-primary">
                {getInitials(
                  `${employee?.first_name || ""} ${employee?.last_name || ""}`,
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-primary">
                  {employee?.first_name} {employee?.last_name}
                </h2>
                {isActive ? (
                  <Tooltip
                    title="This employee is active and can be assigned equipment."
                    placement="top"
                  >
                    <TooltipTrigger className="cursor-default">
                      <BadgeWithDot color="success" size="sm" type="pill-color">
                        Active
                      </BadgeWithDot>
                    </TooltipTrigger>
                  </Tooltip>
                ) : (
                  <BadgeWithDot color="gray" size="sm" type="pill-color">
                    Archived
                  </BadgeWithDot>
                )}
              </div>
              <p className="text-sm text-tertiary">{employee?.email}</p>
            </div>
          </div>

          {isActive ? (
            <div className="flex gap-3">
              {showOffboardAction &&
                (isSelfOffboarding ? (
                  <CustomTooltip
                    content={
                      <span className="max-w-[200px] text-xs text-white">
                        Action denied: please use a different admin account to
                        offboard this user.
                      </span>
                    }
                  >
                    {offboardButton}
                  </CustomTooltip>
                ) : (
                  offboardButton
                ))}
              <Button
                size="sm"
                color="primary"
                className="flex-1"
                onClick={onEditProfile}
                data-testid="employeeprofilerail-button-2"
              >
                Edit profile
              </Button>
            </div>
          ) : null}

          <div className="h-px w-full bg-border-secondary" />

          <div className="flex flex-col gap-4">
            {primaryFields.map((field) => (
              <ProfileField key={field.label} label={field.label}>
                {field.value}
              </ProfileField>
            ))}
          </div>

          <Button
            size="sm"
            color="secondary"
            className="w-full"
            onClick={onOpenOtherDetails}
            data-testid="employeeprofilerail-button-3"
          >
            Other details
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default EmployeeProfileRail;
