"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

interface CredentialSectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

const CredentialSection: React.FC<CredentialSectionProps> = ({
  title,
  description,
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="w-full flex flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={cn(
            "text-gray-500 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
  );
};

export default CredentialSection;
