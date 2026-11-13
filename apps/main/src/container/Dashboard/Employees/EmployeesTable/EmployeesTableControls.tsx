"use client";

import { User01 } from "@untitledui/icons";
import {
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/base/button-group/button-group";
import { Input } from "@/components/base/input/input";

export type EmployeeTab = "active" | "archived";

type Props = {
  tab: EmployeeTab;
  onTabChange: (next: EmployeeTab) => void;
  search: string | null;
  onSearchChange: (value: string) => void;
};

const EmployeesTableControls = ({
  tab,
  onTabChange,
  search,
  onSearchChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <ButtonGroup
        size="sm"
        selectionMode="single"
        selectedKeys={new Set([tab])}
        disallowEmptySelection
        onSelectionChange={(keys) => {
          const next = Array.from(keys)[0];
          if (next === "active" || next === "archived") onTabChange(next);
        }}
      >
        <ButtonGroupItem id="active" className="h-10">
          Active
        </ButtonGroupItem>
        <ButtonGroupItem id="archived" className="h-10">
          Archived
        </ButtonGroupItem>
      </ButtonGroup>

      <div className="w-full md:w-80">
        <Input
          size="sm"
          icon={User01}
          placeholder="Search employee"
          value={search ?? ""}
          onChange={onSearchChange}
          aria-label="Search employee"
          wrapperClassName="h-10"
          data-testid="employeestablecontrols-input"
        />
      </div>
    </div>
  );
};

export default EmployeesTableControls;
