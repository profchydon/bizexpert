import SearchWithIcon from "@/components/SearchWithIcon";
import { Badge } from "@/components/ui/badge";
import React, { FC } from "react";

interface Props {
  count: number;
  search: string;
  onSearchChange: (value: string) => void;
}

const CountriesSearchToolbar: FC<Props> = ({
  count,
  search,
  onSearchChange,
}) => (
  <div className="flex flex-col gap-3 border-b border-border-secondary px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-col gap-y-1">
      <h3 className="text-lg font-semibold text-gray-900">
        Countries{" "}
        {count > 0 && (
          <Badge className="empty:hidden bg-primary-25 text-primary-700">
            {count}
          </Badge>
        )}
      </h3>
    </div>
    <SearchWithIcon
      className="h-10 w-full max-w-xs"
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search country"
    />
  </div>
);

export default CountriesSearchToolbar;
