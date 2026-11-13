import { Lock } from "lucide-react";
import { SlideoutData } from "./slideoutData";

export default function ReferenceSlideoutWindow({
  data,
}: Readonly<{ data: SlideoutData }>) {
  if (!data.window) return null;

  return (
    <div className="border-b border-[#eaecf0] px-6 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#475467]">
            {data.isOffboarding ? "Pickup window" : "Delivery window"}
          </p>
          <p className="mt-1 text-sm text-[#475467]">{data.window}</p>
          <p className="mt-1 text-xs text-[#98a2b3]">{data.windowHelp}</p>
          {data.windowLocked && (
            <p className="mt-1 text-xs font-medium text-[#475467]">
              {data.windowLockedNote}
            </p>
          )}
        </div>
        {data.windowLocked && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f2f4f7] px-2 py-1 text-xs font-medium text-[#475467] ring-1 ring-inset ring-[#eaecf0]">
            <Lock className="size-3" /> Locked
          </span>
        )}
      </div>
    </div>
  );
}
