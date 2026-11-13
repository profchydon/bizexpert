import type { ServerOffice } from "@/types/offices";

export const OFFICE_OPTIONS_PER_PAGE = 100;

const resolveOfficeOwnerId = (office: ServerOffice) =>
  office.company_id ?? office.entity?.id;

export const selectOfficesForCompany = (
  offices: ServerOffice[] | undefined,
  companyId: string | undefined,
) => {
  if (!companyId) return [];
  return (offices ?? []).filter(
    (office) => resolveOfficeOwnerId(office) === companyId,
  );
};

export const buildEquipmentOfficeItems = (
  offices: ServerOffice[] | undefined,
) =>
  (offices ?? []).map((office) => ({
    id: String(office.id),
    label: office.name,
    supportingText: [office.country, office.state]
      .filter((part) => Boolean(part))
      .join(", "),
  }));
