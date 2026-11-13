import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  label: string;
}
const FilterCheckboxWrapper: FC<Props> = ({ children, label }) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="font-medium text-sm text-gray-700">{label}</label>
      <>{children}</>
    </div>
  );
};

export default FilterCheckboxWrapper;
