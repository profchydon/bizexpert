import { companiesApi } from "..";

export interface OfficeDeliveryContact {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  job_title?: string | null;
  is_office_admin?: boolean;
}

const getDeliveryContacts = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getDeliveryContacts: query.query<
      ServerResponse<OfficeDeliveryContact[]>,
      { companyId: string; officeId: string }
    >({
      query: ({ companyId, officeId }) => ({
        url: `/${companyId}/offices/${officeId}/delivery-contacts`,
      }),
      providesTags: (_result, _error, { officeId }) => [
        { type: "Office", id: `${officeId}-contacts` },
      ],
    }),
  }),
});

export const { useGetDeliveryContactsQuery } = getDeliveryContacts;
