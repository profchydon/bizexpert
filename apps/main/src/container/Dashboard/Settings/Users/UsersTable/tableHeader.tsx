import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  countLabel?: string;
  selectedValue: string;
  onHandleChange: (value: string) => void;
  search: string;
  setSearch?: React.Dispatch<React.SetStateAction<string | null>>;
  onAddAdmin?: () => void;
}

const TableHeader: React.FC<Props> = ({
  countLabel,
  selectedValue,
  onHandleChange,
  search,
  setSearch,
  onAddAdmin,
}) => {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-semibold text-gray-900">
            {selectedValue === "active" ? "Admin users" : "Pending Invites"}
          </p>
          {countLabel ? (
            <span className="flex size-max items-center whitespace-nowrap rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
              {countLabel}
            </span>
          ) : null}
        </div>
        {onAddAdmin && (
          <Button
            onClick={onAddAdmin}
            className="h-9 rounded-md bg-primary-600 px-3 text-sm font-semibold text-white"
            data-testid="userstableheader-button"
          >
            <Plus className="mr-2 size-4" />
            Add admin
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <ToggleGroup
          type="single"
          value={selectedValue}
          onValueChange={onHandleChange}
          className="h-auto w-fit gap-0 overflow-hidden rounded-lg border border-gray-300 shadow-sm"
        >
          {["active", "pending"].map((item, index) => (
            <ToggleGroupItem
              value={item}
              key={index}
              className={`relative rounded-none px-4 py-2.5 ${
                selectedValue === item ? "bg-gray-50" : "bg-white"
              } ${
                index !== 0
                  ? "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:border-l before:border-gray-300"
                  : ""
              }`}
            >
              <p className="text-gray-700 font-semibold text-sm">
                {capitalizeFirstLetter(item)}
              </p>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex-1 md:w-56 md:flex-none">
          <SearchWithIcon
            className="h-9 w-full rounded-lg border-gray-300"
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch?.(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default TableHeader;
