import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RetrievalWindowPicker from "./RetrievalWindowPicker";
import { MIN_WINDOW_DAYS, type DateWindow } from "./retrievalWindow";

interface Props {
  value?: DateWindow;
  onApply: (window: DateWindow) => void;
}

const OffboardingWindowCard: React.FC<Props> = ({ value, onApply }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary-600" />
        <p className="text-sm font-semibold text-gray-900">
          Off-boarding window
        </p>
        <Badge variant="gray" className="rounded-full">
          Required
        </Badge>
      </div>
      <p className="text-xs text-gray-600">
        Rayda retrieves devices within this window. The employee is archived
        once all devices are picked up.
      </p>
      <div className="flex flex-col gap-1.5">
        <RetrievalWindowPicker value={value} onApply={onApply} />
        <p className="text-xs text-gray-500">
          Minimum retrieval window is {MIN_WINDOW_DAYS} days.
        </p>
      </div>
    </div>
  );
};

export default OffboardingWindowCard;
