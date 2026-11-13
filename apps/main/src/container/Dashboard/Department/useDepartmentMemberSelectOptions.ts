import { useMemo } from "react";

import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { mapEmployeesToAutocompleteOptions } from "@/components/ui/autocompleteMultiValue";
import { IEmployees } from "@/types/employees";

export function useDepartmentMemberSelectOptions(companyId?: string) {
  const { data: employeesRes, isLoading } = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );

  const options = useMemo(
    () =>
      mapEmployeesToAutocompleteOptions(
        (employeesRes?.data.data as IEmployees[]) ?? [],
      ),
    [employeesRes?.data.data],
  );

  return { options, isLoading };
}

export function mapDepartmentMembersToSelectedOptions(members: IEmployees[]) {
  return mapEmployeesToAutocompleteOptions(members);
}
