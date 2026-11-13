"use client";

import { useGetOfficeQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffice";
import { useGetOfficesQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffices";
import { officeDetailHref } from "@/container/Dashboard/Accounts/Offices/utils/officeDetailHref";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  OFFICE_LOOKUP_PER_PAGE,
  findOfficeById,
  officeEntityId,
  officeEntityRef,
} from "@/container/Dashboard/AllEquipments/ViewEquipment/officeEntityLookup";
import routes from "@/routes";
import { useAuthUserDetail } from "@/utils/useAuthUser";

export const useOfficeLookup = (officeId: string | undefined | null) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const detail = useGetOfficeQuery(
    { companyId: companyId as string, officeId: officeId as string },
    { skip: !companyId || !officeId },
  );

  const list = useGetOfficesQuery(
    {
      companyId: companyId as string,
      params: { per_page: OFFICE_LOOKUP_PER_PAGE },
    },
    { skip: !companyId || !officeId || !detail.isError },
  );

  const office =
    detail.data?.data ?? findOfficeById(list.data?.data?.data, officeId);

  return { company, office };
};

export function useOfficeDetailHref(officeId: string | undefined | null) {
  const { office } = useOfficeLookup(officeId);

  const entityId = officeEntityId(office);

  if (!officeId || !entityId) return null;

  return officeDetailHref({ id: officeId, subsidiaryId: entityId });
}

export function useOfficeEntity(officeId: string | undefined | null) {
  const { company, office } = useOfficeLookup(officeId);

  const entity = officeEntityRef(office, company);

  if (!entity) return null;

  return { ...entity, href: routes.SUBSIDIARY_DETAIL(entity.id) };
}
