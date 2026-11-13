"use client";

import { CheckCircle, MinusCircle } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import {
  buildEquipmentScoreChecklist,
  type EquipmentScoreChecklistAction,
} from "./equipmentScoreChecklist";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  missing_information: string[];
  handleEquipmentEdit: () => void;
  handleAssignEquipment: () => void;
  handleCreateCatalog: () => void;
  handleRefreshEquipment: () => void;
  equipmentStatus: string;
}

const EquipmentScoreModal = ({
  isOpen,
  onClose,
  missing_information,
  handleEquipmentEdit,
  handleAssignEquipment,
  handleCreateCatalog,
  handleRefreshEquipment,
  equipmentStatus,
}: Props) => {
  const items = buildEquipmentScoreChecklist(
    missing_information,
    equipmentStatus,
  );

  const runAction = (action: EquipmentScoreChecklistAction) => {
    onClose();
    if (action === "assign") {
      handleAssignEquipment();
      return;
    }
    if (action === "createCatalog") {
      handleCreateCatalog();
      return;
    }
    if (action === "refresh") {
      handleRefreshEquipment();
      return;
    }
    handleEquipmentEdit();
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      data-testid="equipmentscoremodal-dialog"
    >
      <Modal className="max-w-100">
        <Dialog
          aria-label="Equipment score checklist"
          data-testid="equipmentscoremodal-dialog"
        >
          <div className="flex w-full flex-col rounded-xl bg-primary p-6 shadow-xl">
            <FeaturedIcon
              icon={CheckCircle}
              size="lg"
              color="brand"
              theme="light"
            />
            <h3 className="mt-4 text-lg font-semibold text-primary">
              Equipment score checklist
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              Here are some simple steps to achieve a high score.
            </p>

            <ul className="mt-5 flex max-h-64 flex-col gap-4 overflow-y-auto pr-1">
              {items.map((item) => {
                const actionButton = (
                  <Button
                    size="sm"
                    color="secondary"
                    isDisabled={item.isDisabled}
                    onPress={() => runAction(item.action)}
                    data-testid="equipmentscoremodal-button"
                  >
                    {item.buttonLabel}
                  </Button>
                );

                return (
                  <li key={item.key} className="flex items-center gap-3">
                    <MinusCircle className="size-5 shrink-0 text-fg-quaternary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-primary">
                        {item.label}
                      </p>
                      <p className="text-xs text-tertiary">
                        +{item.weight}% to your score
                      </p>
                    </div>
                    {item.isDisabled && item.disabledReason ? (
                      <DisabledWithTooltip
                        isDisabled={item.isDisabled}
                        reason={item.disabledReason}
                      >
                        {actionButton}
                      </DisabledWithTooltip>
                    ) : (
                      actionButton
                    )}
                  </li>
                );
              })}
            </ul>

            <Button
              size="md"
              color="secondary"
              className="mt-6 w-full"
              onPress={onClose}
              data-testid="equipmentscoremodal-button-2"
            >
              Cancel
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default EquipmentScoreModal;
