"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import type { SelectItemType } from "@/components/base/select/select";
import { useLazyGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { getInitials } from "@/utils/getInitials";
import { employeeOptionLabel } from "@/utils/employeeOptions";
import type { IEmployees } from "@/types/employees";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { withCurrentSelectOption } from "./editEmployeeFormOptions";

const lineManagerPageSize = 20;

function toLineManagerItem(
  employee: Partial<IEmployees>,
): SelectItemType | null {
  const id = employee.id != null ? String(employee.id) : "";
  if (!id) return null;

  const label = employeeOptionLabel(employee);
  return {
    id,
    label,
    initials: getInitials(label) ?? undefined,
    supportingText: employee.email ?? undefined,
  };
}

export function useLineManagerSelectItems(
  excludeEmployeeId?: string,
  selected?: { id?: string | null; label?: string },
) {
  const companyId = useWorkspaceCompanyId();
  const [query, setQuery] = useState("");
  const [search] = useDebounce(query.trim(), 400);
  const [items, setItems] = useState<SelectItemType[]>([]);
  const [loadEmployees, { isFetching }] = useLazyGetEmployeesQuery();

  useEffect(() => {
    if (!companyId) {
      setItems([]);
      return;
    }

    let cancelled = false;

    void loadEmployees({
      companyId,
      params: {
        page: 1,
        paginate: true,
        per_page: lineManagerPageSize,
        search: search || undefined,
      },
    })
      .unwrap()
      .then((response) => {
        if (cancelled) return;

        const next = (response.data?.data as Partial<IEmployees>[]).flatMap(
          (employee) => {
            const item = toLineManagerItem(employee);
            if (!item || item.id === excludeEmployeeId) return [];
            return [item];
          },
        );
        setItems(next);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, excludeEmployeeId, loadEmployees, search]);

  const options = useMemo(() => {
    const value = selected?.id ?? "";
    const merged = withCurrentSelectOption(items, value, selected?.label);
    if (!value) return merged;

    return merged.map((item) =>
      item.id === value && !item.initials
        ? {
            ...item,
            initials: getInitials(item.label ?? value) ?? undefined,
          }
        : item,
    );
  }, [items, selected?.id, selected?.label]);

  return { items: options, setQuery, isFetching };
}
