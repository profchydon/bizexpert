import React from "react";
import SearchWithIcon from "@/components/SearchWithIcon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

type EmployeeFilterValue = "active" | "archived";

interface Props {
  selectedFilterValue: EmployeeFilterValue;
  onFilterValueChange: (value: EmployeeFilterValue) => void;
  search: string | null;
  onSearchChange: (value: string) => void;
}

const EmployeesTableToolbar: React.FC<Props> = ({
  selectedFilterValue,
  onFilterValueChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center md:justify-between px-4">
      <ToggleGroup
        type="single"
        defaultValue={selectedFilterValue}
        value={selectedFilterValue}
        onValueChange={onFilterValueChange}
        className="w-fit h-auto rounded-lg border-[1px] border-gray-300 flex flex-row gap-0"
      >
        {["active", "archived"].map((item) => (
          <ToggleGroupItem
            value={item}
            key={item}
            className={`relative ${selectedFilterValue === item ? "bg-gray-50" : "bg-white"} ${
              item === "active"
                ? ""
                : "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:border-l before:border-gray-300"
            }`}
          >
            <p className="text-gray-700 font-semibold">
              {capitalizeFirstLetter(item)}
            </p>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-fit">
        <SearchWithIcon
          className="w-full md:w-[280px]"
          value={search}
          placeholder="Search employee"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EmployeesTableToolbar;
