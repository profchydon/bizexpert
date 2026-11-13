import { useEffect, useMemo } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetDeliverableOfficesQuery } from "@/api/baseQueries/companiesApi/officesApi/getDeliverableOffices";
import { useGetDeliveryContactsQuery } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import type { Office } from "@/container/Dashboard/Accounts/types";
import { toUiOffice } from "@/container/Dashboard/Accounts/Offices/utils/mapServerOffice";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import { getCartCountry } from "./cartCountry";
import type { AssignmentUnit } from "./types";

function contactName(contact: OfficeDeliveryContact): string {
  return [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function defaultContactFromList(
  contacts: OfficeDeliveryContact[],
): { contactEmployeeId: string; contactEmployeeName: string } | null {
  const admin = contacts.find((contact) => contact.is_office_admin);
  const first = admin ?? contacts[0];
  if (!first) return null;
  return {
    contactEmployeeId: first.id,
    contactEmployeeName: contactName(first),
  };
}

export function useAssignmentOffices(assignments: AssignmentUnit[]) {
  const companyId = useWorkspaceCompanyId();
  const { data } = useGetDeliverableOfficesQuery(
    { companyId: companyId as string },
    { skip: !companyId },
  );

  const offices: Office[] = useMemo(
    () => (data?.data ?? []).map((row) => toUiOffice(row)),
    [data],
  );

  const countryCodes = useMemo(
    () =>
      Array.from(
        new Set(
          assignments.map((unit) =>
            getCartCountry(unit.cartItem).code.toUpperCase(),
          ),
        ),
      ),
    [assignments],
  );

  const relevantOffices = useMemo(
    () =>
      offices.filter((office) =>
        countryCodes.some(
          (code) => (office.region || "").toUpperCase() === code,
        ),
      ),
    [countryCodes, offices],
  );

  return { offices, relevantOffices, companyId };
}

export function useOfficeDeliveryContacts(
  companyId: string | undefined,
  officeId: string | undefined,
) {
  const { data } = useGetDeliveryContactsQuery(
    { companyId: companyId as string, officeId: officeId as string },
    { skip: !companyId || !officeId },
  );
  return data?.data ?? [];
}

export function useOfficeContactMap(
  companyId: string | undefined,
  officeIds: string[],
) {
  const firstOfficeId = officeIds[0];
  const { data } = useGetDeliveryContactsQuery(
    { companyId: companyId as string, officeId: firstOfficeId as string },
    { skip: !companyId || !firstOfficeId },
  );

  const map = useMemo(() => {
    const next: Record<
      string,
      { contactEmployeeId: string; contactEmployeeName: string }
    > = {};
    const list = data?.data ?? [];
    const contact = defaultContactFromList(list);
    if (firstOfficeId && contact) {
      next[firstOfficeId] = contact;
    }
    return next;
  }, [data, firstOfficeId]);

  return map;
}

export function usePrefetchOfficeContacts(
  companyId: string | undefined,
  officeIds: string[],
  onLoaded: (officeId: string, contacts: OfficeDeliveryContact[]) => void,
) {
  useEffect(() => {
    if (!companyId) return;
    officeIds.forEach((officeId) => {
      void officeId;
    });
  }, [companyId, officeIds, onLoaded]);
}
