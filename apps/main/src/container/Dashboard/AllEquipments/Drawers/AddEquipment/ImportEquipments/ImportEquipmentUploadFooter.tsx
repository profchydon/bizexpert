"use client";

import { Button } from "@/components/base/buttons/button";
import { addEquipmentFooterBorderClass } from "../addEquipmentSlideoutResize";

type Props = {
  onClose: () => void;
};

const ImportEquipmentUploadFooter = ({ onClose }: Props) => (
  <div
    className={`flex w-full shrink-0 items-center justify-end gap-3 px-6 py-4 ${addEquipmentFooterBorderClass}`}
  >
    <Button
      size="md"
      color="secondary"
      onPress={onClose}
      data-testid="importequipmentuploadfooter-button"
    >
      Cancel
    </Button>
  </div>
);

export default ImportEquipmentUploadFooter;
