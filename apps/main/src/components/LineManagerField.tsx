import { useEffect, useMemo, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import type { GroupBase, StylesConfig } from "react-select";
import type { LoadOptions } from "react-select-async-paginate";

import { useLazyGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  employeesToOptions,
  type EmployeeOption,
} from "@/utils/employeeOptions";

const lineManagerPageSize = 20;

const selectStyles: StylesConfig<EmployeeOption, false> = {
  control: (provided) => ({
    ...provided,
    borderColor: "#EAECF0",
    borderRadius: "6px",
    color: "#475467",
    fontSize: "15px",
    paddingBottom: "4px",
    paddingTop: "4px",
    "&:hover": { borderColor: "#EAECF0" },
  }),
  menu: (provided) => ({ ...provided, zIndex: 1100 }),
  menuPortal: (provided) => ({ ...provided, zIndex: 1100 }),
  option: (provided) => ({ ...provided, fontSize: "14px" }),
};

type LineManagerFieldProps = {
  value?: string | null;
  selectedLabel?: string;
  excludeEmployeeId?: string;
  onChange: (value: string) => void;
};

export default function LineManagerField({
  value,
  selectedLabel,
  excludeEmployeeId,
  onChange,
}: LineManagerFieldProps) {
  const companyId = useWorkspaceCompanyId();
  const [loadEmployees] = useLazyGetEmployeesQuery();
  const [selectedOption, setSelectedOption] = useState<EmployeeOption | null>(
    null,
  );
  const selected = useMemo(
    () => selectedOption ?? selectedManagerOption(value, selectedLabel),
    [selectedLabel, selectedOption, value],
  );

  useEffect(() => {
    setSelectedOption((current) => {
      if (!value) return null;
      if (current?.value === value && current.label !== current.value) {
        return current;
      }
      return selectedManagerOption(value, selectedLabel);
    });
  }, [selectedLabel, value]);

  const loadOptions: LoadOptions<
    EmployeeOption,
    GroupBase<EmployeeOption>,
    { page: number }
  > = async (search, _loadedOptions, additional) => {
    if (!companyId) {
      return { options: [], hasMore: false, additional: { page: 1 } };
    }
    const page = additional?.page ?? 1;
    const response = await loadEmployees({
      companyId: companyId,
      params: {
        page,
        paginate: true,
        per_page: lineManagerPageSize,
        search: search || undefined,
      },
    }).unwrap();
    const payload = response.data;

    return {
      options: employeesToOptions(payload.data, excludeEmployeeId),
      hasMore: (payload.current_page ?? page) < (payload.last_page ?? 1),
      additional: { page: page + 1 },
    };
  };

  return (
    <AsyncPaginate
      additional={{ page: 1 }}
      cacheUniqs={[companyId, excludeEmployeeId]}
      debounceTimeout={400}
      defaultOptions
      isClearable
      loadOptions={loadOptions}
      menuPortalTarget={globalThis.document?.body}
      menuPosition="fixed"
      onChange={(option) => {
        setSelectedOption(option ?? null);
        onChange(option?.value ?? "");
      }}
      placeholder="Select line manager"
      styles={selectStyles}
      value={selected}
    />
  );
}

function selectedManagerOption(value?: string | null, label?: string) {
  if (!value) return null;
  return { value, label: label || value };
}
