import React, { ReactNode } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface Props {
  children: ReactNode;
  title: string;
}

const CheckboxDropdown: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="pl-[6px] pt-[10px] bg-white rounded-b-lg mt-2">
      <section className="flex justify-between items-center mb-[0.625rem]">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <MdKeyboardArrowDown size={22} className="text-gray-500" />
      </section>
      <section
        className={
          React.Children.count(children) < 7
            ? "space-y-2"
            : "space-y-2 overflow-y-scroll h-72"
        }
      >
        {children}
      </section>
    </div>
  );
};

export default CheckboxDropdown;
