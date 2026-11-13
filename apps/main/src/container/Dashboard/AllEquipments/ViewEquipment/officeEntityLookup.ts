import type { OfficeEntityRef, ServerOffice } from "@/types/offices";

export const OFFICE_LOOKUP_PER_PAGE = 100;

export const findOfficeById = (
  offices: ServerOffice[] | undefined,
  officeId: string | undefined | null,
) => {
  if (!officeId) return undefined;
  return (offices ?? []).find(
    (office) => String(office?.id) === String(officeId),
  );
};

export const officeEntityId = (office: ServerOffice | undefined) =>
  office?.entity?.id ?? office?.company_id ?? "";

export const officeEntityRef = (
  office: ServerOffice | undefined,
  company: { id?: string; name?: string } | undefined,
): OfficeEntityRef | null => {
  if (!office) return null;
  const id = officeEntityId(office) || company?.id;
  const name = office.entity?.name ?? company?.name;
  if (!id || !name) return null;
  return { id, name };
};
