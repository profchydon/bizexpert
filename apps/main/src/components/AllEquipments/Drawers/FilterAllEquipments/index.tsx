"use client";

import { useEffect, useRef, useState } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getApplyingFiltersDisabledReason } from "@/components/AllEquipments/equipmentDisabledReasons";
import { EquipmentFilterFields } from "./EquipmentFilterFields";
import {
  EMPTY_EQUIPMENT_FILTER_VALUES,
  normalizeEquipmentFilterValues,
  type EquipmentFilterValues,
} from "./equipmentFilterOptions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  values: EquipmentFilterValues;
  onApply: (values: EquipmentFilterValues) => void;
  isApplying?: boolean;
};

const FilterOffboardingEquipments = ({
  isOpen,
  onClose,
  values,
  onApply,
  isApplying = false,
}: Props) => {
  const [draft, setDraft] = useState<EquipmentFilterValues>(
    EMPTY_EQUIPMENT_FILTER_VALUES,
  );
  const [seed, setSeed] = useState(0);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setDraft(normalizeEquipmentFilterValues(values));
      setSeed((current) => current + 1);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, values]);

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel="Equipment filters"
      data-testid="filterallequipments-drawerright"
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <div className="flex flex-col gap-1 pr-8">
          <h2 className="text-lg font-semibold text-primary">Filters</h2>
          <p className="text-sm text-tertiary">Apply filters to table data..</p>
        </div>
      </SlideoutMenu.Header>

      <SlideoutMenu.Content>
        <EquipmentFilterFields
          key={seed}
          draft={draft}
          onChange={(patch) =>
            setDraft((current) => ({ ...current, ...patch }))
          }
        />
      </SlideoutMenu.Content>

      <SlideoutMenu.Footer>
        <div className="flex w-full items-center justify-between gap-3">
          <DisabledWithTooltip
            isDisabled={isApplying}
            reason={getApplyingFiltersDisabledReason(isApplying)}
          >
            <Button
              size="md"
              color="link-gray"
              isDisabled={isApplying}
              onClick={() => {
                setDraft(EMPTY_EQUIPMENT_FILTER_VALUES);
                setSeed((current) => current + 1);
                onApply(EMPTY_EQUIPMENT_FILTER_VALUES);
              }}
              data-testid="filterallequipments-button"
            >
              Clear filter
            </Button>
          </DisabledWithTooltip>
          <div className="flex items-center gap-3">
            <DisabledWithTooltip
              isDisabled={isApplying}
              reason={getApplyingFiltersDisabledReason(isApplying)}
            >
              <Button
                size="md"
                color="secondary"
                isDisabled={isApplying}
                onClick={onClose}
                data-testid="filterallequipments-button-2"
              >
                Cancel
              </Button>
            </DisabledWithTooltip>
            <Button
              size="md"
              color="primary"
              isLoading={isApplying}
              onClick={() => onApply(draft)}
              data-testid="filterallequipments-button-3"
            >
              Apply
            </Button>
          </div>
        </div>
      </SlideoutMenu.Footer>
    </SlideoutMenu>
  );
};

export default FilterOffboardingEquipments;
