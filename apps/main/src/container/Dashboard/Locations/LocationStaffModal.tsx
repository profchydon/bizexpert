"use client";

import { Users, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Location } from "@/types/bizexpert";
import { LocationStaffPanel } from "./LocationStaffPanel";
import {
  locationsStaffModalBodyClass,
  locationsStaffModalCloseButtonClass,
  locationsStaffModalContentClass,
  locationsStaffModalDescriptionClass,
  locationsStaffModalFooterClass,
  locationsStaffModalHeaderClass,
  locationsStaffModalTitleClass,
} from "./locationsPageClasses";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  location: Location;
};

export function LocationStaffModal({
  isOpen,
  onClose,
  businessId,
  location,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className={locationsStaffModalContentClass}
        showCloseButton={false}
      >
        <div className={locationsStaffModalHeaderClass}>
          <FeaturedIcon icon={Users} color="brand" size="md" />
          <button
            type="button"
            className={locationsStaffModalCloseButtonClass}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <DialogTitle className={locationsStaffModalTitleClass}>
          Manage staff
        </DialogTitle>
        <p className={locationsStaffModalDescriptionClass}>
          Assign team members to {location.name} and set what they can do.
        </p>
        <div className={locationsStaffModalBodyClass}>
          <LocationStaffPanel
            businessId={businessId}
            locationId={location.id}
          />
        </div>
        <div className={locationsStaffModalFooterClass}>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
