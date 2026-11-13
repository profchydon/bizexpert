import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmployeeOption } from "./types";
import { isEmployeeInCountry } from "./utils";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { getInitials } from "@/utils/getInitials";
import { cn } from "@/lib/utils";
import EmployeePickerAvatar from "./EmployeePickerAvatar";

const ADD_EMPLOYEE_OPTION_ID = "add_employee";

const getEmployeeDepartment = (employee: EmployeeOption) =>
  employee.raw?.department?.name ||
  employee.raw?.departments?.[0]?.name ||
  employee.raw?.job_title ||
  "";

interface EmployeePickerProps {
  selectedId?: string;
  employees: EmployeeOption[];
  countryLabel?: string;
  countryCode?: string;
  onSelect: (employeeId: string, employeeName: string) => void;
  onAddEmployeeAction?: () => void;
  showAddEmployeeAction?: boolean;
  isDisabled?: boolean;
  isWarning?: boolean;
  allowCrossCountryFallback?: boolean;
}

const EmployeePicker: React.FC<EmployeePickerProps> = ({
  selectedId,
  employees,
  countryLabel,
  countryCode,
  onSelect,
  onAddEmployeeAction,
  showAddEmployeeAction = true,
  isDisabled,
  isWarning,
  allowCrossCountryFallback = false,
}) => {
  const [open, setOpen] = useState(false);
  const scopedEmployees = employees.filter((item) =>
    isEmployeeInCountry(item, countryLabel, countryCode),
  );
  const withFallback = useMemo(() => {
    if (scopedEmployees.length === 0 && allowCrossCountryFallback) {
      return employees;
    }

    if (scopedEmployees.length === 0 && !allowCrossCountryFallback) {
      return [];
    }

    return scopedEmployees;
  }, [allowCrossCountryFallback, employees, scopedEmployees]);

  const items: EmployeeOption[] = showAddEmployeeAction
    ? [
        { id: ADD_EMPLOYEE_OPTION_ID, name: "Add Employee" } as EmployeeOption,
        ...withFallback,
      ]
    : withFallback;

  const selectedEmp = selectedId
    ? withFallback.find((item) => item.id === selectedId)
    : undefined;
  const selectedInitials = selectedEmp
    ? getInitials(selectedEmp.name || "")
    : null;
  const selectedDepartment = selectedEmp
    ? getEmployeeDepartment(selectedEmp)
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Assign employee"
          aria-expanded={open}
          aria-disabled={isDisabled}
          disabled={isDisabled}
          className={cn(
            "flex h-9 w-full min-w-[200px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-left text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30",
            isDisabled && "cursor-not-allowed bg-gray-100 text-gray-400",
            isWarning && "ring-1 ring-[#fec84b]",
          )}
        >
          {selectedEmp ? (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-gray-100 text-[10px] font-medium text-gray-600">
                {selectedInitials || "NA"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
          <span
            className={cn(
              "truncate",
              selectedEmp ? "text-gray-900" : "text-gray-500",
            )}
          >
            {selectedEmp?.name || "Select employee"}
          </span>
          {selectedDepartment && (
            <span className="truncate text-xs text-gray-500">
              {selectedDepartment}
            </span>
          )}
          {selectedEmp?.countryName && (
            <span className="truncate text-xs text-gray-500">
              {selectedDepartment
                ? `· ${selectedEmp.countryName}`
                : selectedEmp.countryName}
            </span>
          )}

          <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="min-w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search employee..." />
          <CommandList>
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {items.map((employee) => {
                const isAddAction = employee.id === ADD_EMPLOYEE_OPTION_ID;
                const initials = getInitials(employee.name || "") || "NA";

                return (
                  <CommandItem
                    key={employee.id}
                    value={`${employee.name} ${employee.countryName || ""}`}
                    onSelect={() => {
                      if (isAddAction) {
                        onAddEmployeeAction?.();
                        setOpen(false);
                        return;
                      }

                      onSelect(employee.id, employee.name);
                      setOpen(false);
                    }}
                  >
                    {isAddAction ? (
                      <Plus className="mr-2 h-4 w-4" />
                    ) : (
                      <EmployeePickerAvatar
                        className="mr-2 h-5 w-5"
                        initials={initials}
                        email={employee.raw?.email}
                      />
                    )}
                    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                      <span className="truncate text-sm font-medium text-gray-900">
                        {employee.name}
                      </span>
                      {getEmployeeDepartment(employee) && !isAddAction && (
                        <span className="shrink-0 text-xs text-gray-500">
                          {getEmployeeDepartment(employee)}
                        </span>
                      )}
                      {employee.countryName && !isAddAction && (
                        <span className="shrink-0 text-xs text-gray-500">
                          {getEmployeeDepartment(employee)
                            ? `· ${employee.countryName}`
                            : employee.countryName}
                        </span>
                      )}
                    </div>

                    {selectedId === employee.id && (
                      <Check className="ml-auto h-4 w-4 text-primary-600" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EmployeePicker;
