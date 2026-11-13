import React from "react";
import { PackagePlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  onAddDevice: () => void;
}

const DeviceSelectionEmpty: React.FC<Props> = ({ onAddDevice }) => {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <PackagePlus className="h-8 w-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-gray-900">
          No devices added yet
        </h3>
        <p className="text-sm text-gray-500">
          Click &quot;Add Device&quot; to browse the marketplace or check
          storage.
        </p>
      </div>
      <Button
        type="button"
        variant="primary"
        className="h-11 gap-2 px-4 text-sm font-semibold"
        onClick={onAddDevice}
        data-testid="deviceselectionempty-button"
      >
        <Plus className="h-4 w-4" />
        Add Device
      </Button>
    </Card>
  );
};

export default DeviceSelectionEmpty;
