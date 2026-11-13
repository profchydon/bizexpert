"use client";

import { User01 } from "@untitledui/icons";
import {
  RadioCard,
  RadioCardGroup,
} from "@/components/application/radio-card/radio-card";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { REASSIGN_EQUIPMENT_OPTIONS } from "./reassignSelectEquipmentOptions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedStep: string;
  setSelectedStep: (value: string) => void;
  handleContinue: () => void;
}

const ReassignSelectEquipmentModal = ({
  isOpen,
  onClose,
  selectedStep,
  setSelectedStep,
  handleContinue,
}: Props) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => !open && onClose()}
    data-testid="reassignselectequipment-dialog"
  >
    <DialogContent
      className="max-w-lg gap-0 rounded-2xl border-0 bg-primary p-6 shadow-xl"
      showCloseButton={false}
    >
      <div className="flex items-start justify-between gap-4">
        <FeaturedIcon icon={User01} color="brand" theme="light" size="md" />
        <CloseButton size="md" onClick={onClose} />
      </div>

      <DialogTitle className="mt-4 text-lg font-semibold text-primary">
        Reassign equipment
      </DialogTitle>
      <p className="mt-1 text-sm text-tertiary">
        What type of reassignment do you wish to do?
      </p>

      <RadioCardGroup
        columns={1}
        aria-label="Reassignment type"
        className="mt-5"
        value={selectedStep}
        onChange={setSelectedStep}
      >
        {REASSIGN_EQUIPMENT_OPTIONS.map((option) => (
          <RadioCard
            key={option.id}
            value={option.id}
            icon={option.icon}
            label={option.label}
            description={option.description}
            isDisabled={!option.enabled}
            data-testid="reassignselectequipment-checkbox"
          />
        ))}
      </RadioCardGroup>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          color="secondary"
          size="md"
          className="w-full"
          onClick={onClose}
          data-testid="reassignselectequipment-button"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          size="md"
          className="w-full"
          isDisabled={!selectedStep}
          onClick={handleContinue}
          data-testid="reassignselectequipment-button-2"
        >
          Confirm
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default ReassignSelectEquipmentModal;
