import { useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { ICart } from "@/types/cart";
import {
  buildAssignmentCountries,
  buildAssignmentCountriesKey,
} from "./assignmentCountries";
import { mapEmployeeOptions } from "./utils";
import { EmployeeOption } from "./types";

interface FallbackCountry {
  id?: string;
  code?: string;
  name?: string;
}

const useAssignmentEmployees = (
  companyId: string | undefined,
  carts: ICart[],
  fallbackCountry?: FallbackCountry,
) => {
  const [fetchEmployees] = useLazyGetEmployeesQuery();
  const [employeesByCountryCode, setEmployeesByCountryCode] = useState<
    Record<string, EmployeeOption[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const fallbackCountryKey = [
    fallbackCountry?.id ?? "",
    fallbackCountry?.code ?? "",
    fallbackCountry?.name ?? "",
  ].join(":");

  const countriesKey = useMemo(
    () => buildAssignmentCountriesKey(carts, fallbackCountry),
    [carts, fallbackCountryKey],
  );

  const cartsRef = useRef(carts);
  cartsRef.current = carts;
  const fallbackCountryRef = useRef(fallbackCountry);
  fallbackCountryRef.current = fallbackCountry;
  const fetchEmployeesRef = useRef(fetchEmployees);
  fetchEmployeesRef.current = fetchEmployees;

  useEffect(() => {
    if (!companyId || !countriesKey) {
      setEmployeesByCountryCode({});
      setIsLoading(false);
      setIsReady(true);
      return;
    }

    const countries = buildAssignmentCountries(
      cartsRef.current,
      fallbackCountryRef.current,
    );
    let cancelled = false;

    setIsLoading(true);
    setIsReady(false);

    Promise.all(
      countries.map(async (country) => {
        const fetchEmployeesForCountry = fetchEmployeesRef.current;
        const response = await fetchEmployeesForCountry({
          companyId,
          params: {
            paginate: false,
            country_code: country.code,
            ...(country.countryId ? { country_id: country.countryId } : {}),
          },
        }).unwrap();

        return [
          country.code,
          mapEmployeeOptions(response.data?.data ?? []),
        ] as const;
      }),
    )
      .then((entries) => {
        if (cancelled) {
          return;
        }

        setEmployeesByCountryCode(Object.fromEntries(entries));
        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setEmployeesByCountryCode({});
          setIsReady(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, countriesKey, reloadKey]);

  const allEmployees = useMemo(() => {
    const byId = new Map<string, EmployeeOption>();

    Object.values(employeesByCountryCode).forEach((employees) => {
      employees.forEach((employee) => {
        byId.set(employee.id, employee);
      });
    });

    return Array.from(byId.values());
  }, [employeesByCountryCode]);

  const getEmployeesForCountry = (countryCode: string) =>
    employeesByCountryCode[countryCode.toUpperCase()] ?? [];

  return {
    allEmployees,
    employeesByCountryCode,
    getEmployeesForCountry,
    isLoading,
    isReady,
    refetch: () => setReloadKey((current) => current + 1),
  };
};

export default useAssignmentEmployees;
