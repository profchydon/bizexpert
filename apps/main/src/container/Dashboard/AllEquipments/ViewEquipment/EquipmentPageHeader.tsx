"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  HomeLine,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getEquipmentNavigationDisabledReason } from "@/components/AllEquipments/equipmentDisabledReasons";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import { IEquipment } from "@/types/equipments";
import { useEquipmentAdjacentNavigation } from "./useEquipmentAdjacentNavigation";
import {
  viewEquipmentBreadcrumbClass,
  viewEquipmentBreadcrumbCurrentClass,
  viewEquipmentBreadcrumbLinkClass,
  viewEquipmentHeaderActionsClass,
  viewEquipmentHeaderClass,
  viewEquipmentHeaderDescriptionClass,
  viewEquipmentHeaderDividerClass,
  viewEquipmentHeaderTitleClass,
  viewEquipmentHeaderTopClass,
} from "./viewEquipmentClasses";

interface Props {
  allEquipment: IEquipment[];
}

type NavigationDirection = "prev" | "next";

const EquipmentPageHeader = ({ allEquipment }: Props) => {
  const equipmentListHref = useListReturnHref(routes.All_Equipments);
  const { push, isPending } = useTransitionRouter();
  const [activeDirection, setActiveDirection] =
    useState<NavigationDirection | null>(null);
  const {
    equipmentIds,
    currentIndex,
    hasPrev,
    hasNext,
    isResolvingNavigation,
  } = useEquipmentAdjacentNavigation(allEquipment);

  const goToIndex = (index: number, direction: NavigationDirection) => {
    const targetId = equipmentIds[index];
    if (!targetId) return;
    setActiveDirection(direction);
    push(`${routes.All_Equipments}/${targetId}${window.location.search}`);
  };

  return (
    <div className={viewEquipmentHeaderClass}>
      <div className={viewEquipmentHeaderTopClass}>
        <div className="flex flex-col gap-1">
          <h1 className={viewEquipmentHeaderTitleClass}>View equipment</h1>
          <p className={viewEquipmentHeaderDescriptionClass}>
            See everything about your equipment at a glance.
          </p>
        </div>
        <div className={viewEquipmentHeaderActionsClass}>
          <DisabledWithTooltip
            isDisabled={!hasPrev || isResolvingNavigation}
            reason={getEquipmentNavigationDisabledReason(
              "prev",
              hasPrev,
              isResolvingNavigation,
            )}
          >
            <Button
              size="md"
              color="secondary"
              iconLeading={ArrowLeft}
              isDisabled={!hasPrev || isResolvingNavigation}
              isLoading={isPending && activeDirection === "prev"}
              onClick={() => hasPrev && goToIndex(currentIndex - 1, "prev")}
              data-testid="equipmentpageheader-button"
            >
              Previous equipment
            </Button>
          </DisabledWithTooltip>
          <DisabledWithTooltip
            isDisabled={!hasNext || isResolvingNavigation}
            reason={getEquipmentNavigationDisabledReason(
              "next",
              hasNext,
              isResolvingNavigation,
            )}
          >
            <Button
              size="md"
              color="secondary"
              iconTrailing={ArrowRight}
              isDisabled={!hasNext || isResolvingNavigation}
              isLoading={isPending && activeDirection === "next"}
              onClick={() => hasNext && goToIndex(currentIndex + 1, "next")}
              data-testid="equipmentpageheader-button-2"
            >
              Next equipment
            </Button>
          </DisabledWithTooltip>
        </div>
      </div>

      <nav aria-label="Breadcrumb" className={viewEquipmentBreadcrumbClass}>
        <Link
          href={routes.OVERVIEW}
          aria-label="Dashboard"
          className="rounded-md p-1 text-tertiary transition hover:bg-secondary hover:text-secondary"
        >
          <HomeLine className="size-5" />
        </Link>
        <ChevronRight className="size-4 text-quaternary" aria-hidden />
        <Link
          href={equipmentListHref}
          className={viewEquipmentBreadcrumbLinkClass}
        >
          Manage equipment
        </Link>
        <ChevronRight className="size-4 text-quaternary" aria-hidden />
        <span className={viewEquipmentBreadcrumbCurrentClass}>
          View equipment
        </span>
      </nav>

      <div className={viewEquipmentHeaderDividerClass} />
    </div>
  );
};

export default EquipmentPageHeader;
