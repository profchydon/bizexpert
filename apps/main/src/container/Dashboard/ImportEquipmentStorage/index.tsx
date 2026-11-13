"use client";

import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import routes from "@/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StorageTable from "./StorageTable";
import AddEquipmentsLayout from "./Drawers/AddEquipments";
import ReadyToStoreModal from "./ReadyToStoreModal";

const ImportEquipmentStorageContainer = () => {
  const router = useRouter();

  const [isImportEquipmentsOpen, setIsImportEquipmentsOpen] = useState(false);
  const toggleImportEquipments = () =>
    setIsImportEquipmentsOpen(!isImportEquipmentsOpen);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleStoreModal = () => setIsModalOpen(!isModalOpen);

  const handleClose = () => {
    toggleImportEquipments();
    router.push("/dashboard/storage");
  };

  const handleModalClose = () => {
    toggleStoreModal();
  };

  return (
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            <Link href={routes.OVERVIEW}>Overview</Link>,
            "Storage",
          ]}
          pageTitle="Storage"
          pageDescription="Easily store, manage, and track your company's equipment"
          onBack={() => router.back()}
        >
          <div className="md:self-end flex gap-3 pb-5">
            <Button
              variant="outline"
              data-testid="importequipmentstorage-button"
            >
              <span
                className="text-sm font-semibold"
                onClick={toggleImportEquipments}
              >
                Import equipment
              </span>
            </Button>
            <Button
              variant="primary"
              disabled={false}
              onClick={toggleStoreModal}
              data-testid="importequipmentstorage-button-2"
            >
              <span className="text-sm font-semibold">Continue</span>
            </Button>
          </div>
        </PageHeader>

        <div className="mt-4">
          <StorageTable />
        </div>
        <AddEquipmentsLayout
          isOpen={isImportEquipmentsOpen}
          onClose={handleClose}
        />
      </div>
      <ReadyToStoreModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        isButtonDisabled={true}
      />
    </div>
  );
};

export default ImportEquipmentStorageContainer;
