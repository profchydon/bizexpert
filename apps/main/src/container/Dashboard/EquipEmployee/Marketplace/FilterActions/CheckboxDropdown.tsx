import React, { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  children: ReactNode;
  title: string;
  defaultOpen?: boolean;
}

const CheckboxDropdown: React.FC<Props> = ({
  children,
  title,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between px-3.5 py-2.5"
      >
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <ChevronDown
          className={
            isOpen
              ? "h-5 w-5 text-gray-500 rotate-180 transition-transform duration-200"
              : "h-5 w-5 text-gray-500 transition-transform duration-200"
          }
        />
      </button>

      {isOpen && (
        <section className="flex flex-col gap-1 px-3.5">{children}</section>
      )}
    </div>
  );
};

export default CheckboxDropdown;
