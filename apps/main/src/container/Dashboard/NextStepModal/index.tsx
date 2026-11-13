"use client";

import { useState } from "react";
import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import type { EmployeeAddTab } from "../EquipEmployee/Employee/AddEmployees/addEmployeesPanelTabs";
import { EmployeeOptionCard } from "./EmployeeOptionCard";
import { ModalHeader } from "./ModalHeader";
import { employeeImportOptions } from "./employeeImportOptions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (tab: EmployeeAddTab) => void;
}

const NextStepModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [importMethod, setImportMethod] = useState("");

  const handleClose = () => {
    setImportMethod("");
    onClose();
  };

  const handleGetStarted = () => {
    const selected = employeeImportOptions.find(
      (option) => option.key === importMethod,
    );
    if (!selected) return;
    setImportMethod("");
    onComplete(selected.tab);
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      isDismissable
      className="items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-4"
      data-testid="nextstepmodal-dialog"
    >
      <Modal className="max-w-lg">
        <Dialog
          aria-label="Add your employees to get started"
          data-testid="nextstepmodal-dialog"
        >
          <div className="w-full rounded-2xl bg-primary shadow-2xl">
            <ModalHeader onSkip={handleClose} />
            <div className="px-6 py-5">
              <div className="flex flex-col gap-3">
                {employeeImportOptions.map(
                  ({ description, icon, key, recommended, title }) => (
                    <EmployeeOptionCard
                      key={key}
                      icon={icon}
                      title={title}
                      description={description}
                      recommended={recommended}
                      isSelected={importMethod === key}
                      onClick={() => setImportMethod(key)}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-secondary px-6 py-4">
              <Button
                color="link-gray"
                size="sm"
                onClick={handleClose}
                data-testid="nextstepmodal-button"
              >
                Skip for now
              </Button>
              <Button
                size="md"
                iconTrailing={ArrowRight}
                isDisabled={!importMethod}
                onClick={handleGetStarted}
                data-testid="nextstepmodal-button-2"
              >
                Get started
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default NextStepModal;
