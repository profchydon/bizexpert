import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { empty_store } from "@/assets/icons";
import AddEquipmentsLayout from "./Drawers/AddEquipments";
import { useRouter } from "next/navigation";

const StorageEmptyTable = () => {
  const router = useRouter();
  const [isImportEquipmentsOpen, setIsImportEquipmentsOpen] = useState(false);
  const toggleImportEquipments = () =>
    setIsImportEquipmentsOpen(!isImportEquipmentsOpen);

  const handleClose = () => {
    toggleImportEquipments();
    router.push("/dashboard/storage");
  };

  return (
    <div className="grid place-content-center py-11 w-full m-auto">
      <Image src={empty_store} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center mt-5 space-y-4">
        <h5 className="text-gray-900 text-lg font-semibold">
          No equipment in storage yet
        </h5>
        <p className="text-gray-600 text-sm mt-2">
          No equipment in storage yet, Add items to begin managing your stored
          devices.
        </p>
        <div className="font-semibold text-sm">
          <Button
            onClick={toggleImportEquipments}
            data-testid="storageemptytable-button"
          >
            import equipment
          </Button>
        </div>
      </div>
      <AddEquipmentsLayout
        isOpen={isImportEquipmentsOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default StorageEmptyTable;
