"use client";

import { useState } from "react";
import { Download01 } from "@untitledui/icons";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { FileUpload } from "@/components/application/file-upload/file-upload-drop-zone";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { useQueryClient } from "@tanstack/react-query";
import { readProductsApiError } from "./productsApiError";
import { PRODUCT_FORM_SLIDEOUT_RESIZE } from "./productsPageClasses";
import {
  parseProductImportCsv,
  productImportTemplateCsv,
} from "./productCsvParse";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProductBulkImportSlideout({ isOpen, onClose }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const downloadTemplate = () => {
    const blob = new Blob([productImportTemplateCsv()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "bizexpert-products-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleFiles = async (files: FileList) => {
    if (!businessId) return;
    const file = files[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const text = await file.text();
      const parsed = parseProductImportCsv(text);
      if (parsed.error) {
        setError(parsed.error);
        return;
      }
      const res = await bizexpertApi.post(
        `/businesses/${businessId}/products/bulk-import`,
        { rows: parsed.rows },
      );
      toast.success(`${res.data.created} products imported`);
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["inventory-products"] });
      onClose();
    } catch (err) {
      toast.error(readProductsApiError(err, "Import failed"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel="Import products"
      resizeOptions={PRODUCT_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          Multiple products
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Upload a CSV using the BizExpert template (store name per row).
        </p>
      </SlideoutMenu.Header>
      <SlideoutMenu.Content className="space-y-4">
        <Button type="button" variant="outline" onClick={downloadTemplate}>
          <Download01 className="mr-2 size-4" />
          Download template
        </Button>
        <FileUpload.DropZone accept=".csv" onDropFiles={handleFiles} />
        {error ? <p className="text-sm text-error-600">{error}</p> : null}
        {isUploading ? (
          <p className="text-sm text-tertiary">Uploading products…</p>
        ) : null}
      </SlideoutMenu.Content>
    </SlideoutMenu>
  );
}
