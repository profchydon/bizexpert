"use client";

import { Package, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { locationsDeleteModalContentClass } from "../Locations/locationsPageClasses";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSingle: () => void;
  onBulk: () => void;
};

export function AddProductEntryDialog({
  isOpen,
  onClose,
  onSingle,
  onBulk,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg gap-0 rounded-2xl border-0 bg-white p-6 shadow-xl sm:rounded-2xl">
        <DialogTitle className="text-lg font-semibold text-gray-900">
          Add new product
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm text-gray-600">
          Add one item with variants and opening stock, or import many from CSV.
        </DialogDescription>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 px-4 py-5"
            onClick={() => {
              onClose();
              onSingle();
            }}
          >
            <Package className="size-6 text-primary-600" />
            <span className="text-sm font-semibold">Single product</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 px-4 py-5"
            onClick={() => {
              onClose();
              onBulk();
            }}
          >
            <Upload className="size-6 text-primary-600" />
            <span className="text-sm font-semibold">Multiple products</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
