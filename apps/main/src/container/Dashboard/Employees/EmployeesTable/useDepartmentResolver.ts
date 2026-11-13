import { useMemo } from "react";
import useDepartment from "@/hooks/useDepartment";

export type DepartmentResolver = (id?: string) => string | null;

export const useDepartmentResolver = (): DepartmentResolver => {
  const { getDepartments } = useDepartment();

  return useMemo(() => {
    const map = new Map<string, string>();
    // @ts-ignore
    (getDepartments?.data?.data ?? []).forEach((department: any) => {
      if (department?.id) map.set(department.id, department?.name);
    });
    return (id?: string) => (id ? (map.get(id) ?? null) : null);
  }, [getDepartments]);
};
