"use client";

import React, { FC, useMemo, useState } from "react";
import EquipmentDocumentsColumn from "./tableColumn";
import EquipmentDocumentsAction from "./tableAction";
import { Download01, Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DataTable } from "@/components/ui/data-table";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import CustomModal from "@/components/CustomModal";
import AddDocument from "./AddDocument";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import {
  DeleteEquipmentDocumentRequest,
  IEquipmentDocument,
} from "@/types/equipments";
import { useDeleteEquipmentDocumentMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/deleteEquipmentDocument";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { ViewEquipmentDetailCard } from "../../ViewEquipmentDetailCard";

interface Props {
  equipmentId: string;
  companyId: string;
  documentsData: IEquipmentDocument[];
}

const EquipmentDocuments: FC<Props> = ({
  equipmentId,
  companyId,
  documentsData = [],
}) => {
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const [deleteEquipmentDocument, { isLoading }] =
    useDeleteEquipmentDocumentMutation();

  const onDelete = async (documentId: string) => {
    const payload = {
      companyId,
      equipmentId,
      documentId,
    } as DeleteEquipmentDocumentRequest;

    try {
      await deleteEquipmentDocument(payload).unwrap();
      displaySuccessMessage(
        "Equipment document deteleted successfully",
        "The equipment document has been deleted in the company roster.",
      );
    } catch (error) {
      showApiError(error);
    }
  };

  const handleAllDownload = async () => {
    for (const doc of documentsData) {
      await handleDownload(doc.url);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const columns: any = useMemo(
    () =>
      EquipmentDocumentsColumn(
        (item: IEquipmentDocument) => (
          <EquipmentDocumentsAction
            onDelete={() => onDelete(item?.id)}
            onDownload={() => handleDownload(item?.url)}
            isLoading={isLoading}
          />
        ),
        (item: IEquipmentDocument) => {
          setIsFileViewerOpen(true);
          setFileUrl(item?.url);
        },
      ),
    [documentsData, isLoading],
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        color="secondary"
        iconLeading={Download01}
        onClick={handleAllDownload}
        data-testid="equipmentdocuments-button"
      >
        Download all
      </Button>
      <Button
        size="sm"
        color="primary"
        iconLeading={Plus}
        onClick={() => setIsAddDocumentOpen(true)}
        data-testid="equipmentdocuments-button-2"
      >
        Add document
      </Button>
    </div>
  );

  return (
    <div>
      <ViewEquipmentDetailCard title="Documents" action={headerActions}>
        <DataTable data={documentsData} columns={columns}>
          <EmptyTableInstance
            title="No document yet "
            description="Feel free to upload your document using the button below."
            buttonText="Add document"
            onButtonClick={() => setIsAddDocumentOpen(true)}
          />
        </DataTable>
      </ViewEquipmentDetailCard>

      <CustomModal
        isOpen={isFileViewerOpen}
        onClose={() => setIsFileViewerOpen(false)}
        width={"1024px"}
      >
        {isFileViewerOpen && (
          <DocViewer
            documents={[{ uri: fileUrl }]}
            pluginRenderers={DocViewerRenderers}
            prefetchMethod="GET"
            config={{
              header: {
                disableFileName: true,
                disableHeader: true,
              },
            }}
          />
        )}
      </CustomModal>

      <AddDocument
        isOpen={isAddDocumentOpen}
        onClose={() => setIsAddDocumentOpen(false)}
        equipmentId={equipmentId}
        companyId={companyId}
      />
    </div>
  );
};

export default EquipmentDocuments;
