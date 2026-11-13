import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const CollapsibleSection = ({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mp-flex mp-flex-col mp-gap-4 mp-border-b mp-border-gray-200 mp-py-2 last:mp-border-b-0">
      <button
        type="button"
        className="mp-flex mp-w-full mp-items-center mp-justify-between mp-px-3.5 mp-py-2.5 mp-transition-colors hover:mp-bg-gray-50 mp-rounded-lg"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span className="mp-text-lg mp-font-semibold mp-text-gray-900">
          {title}
        </span>
        <ChevronDown
          className={`mp-h-5 mp-w-5 mp-text-gray-400 mp-transition-transform mp-duration-200 ${isOpen ? "mp-rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mp-flex mp-flex-col mp-gap-1 mp-px-3.5">{children}</div>
      )}
    </div>
  );
};
