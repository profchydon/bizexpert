"use client";

import { Button } from "@/components/base/buttons/button";
import { FileUpload } from "@/components/application/file-upload/file-upload-drop-zone";
import { addEquipmentPanelBorderClass } from "../addEquipmentSlideoutResize";

type Props = {
  onDownloadTemplate: () => void;
  onDropFiles: (files: FileList) => void;
};

const ImportEquipmentUploadPanel = ({
  onDownloadTemplate,
  onDropFiles,
}: Props) => (
  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
    <FileUpload.DropZone
      accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      allowsMultiple={false}
      onDropFiles={onDropFiles}
      hint="CSV or XLSX files only"
    />
    <div
      className={`mt-4 flex items-center justify-between rounded-xl bg-secondary px-4 py-3 ${addEquipmentPanelBorderClass}`}
    >
      <div>
        <p className="text-sm font-medium text-primary">Download template</p>
        <p className="mt-0.5 text-xs text-tertiary">
          Use this template to format your equipment data correctly
        </p>
      </div>
      <Button
        color="secondary"
        size="sm"
        onPress={onDownloadTemplate}
        data-testid="importequipmentuploadpanel-button"
      >
        Download
      </Button>
    </div>
  </div>
);

export default ImportEquipmentUploadPanel;
