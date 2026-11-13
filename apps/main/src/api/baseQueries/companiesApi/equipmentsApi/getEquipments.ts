import { IEquipment } from "@/types/equipments";
import { companiesApi } from "..";

const getEquipments = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getEquipments: query.query<
      ServerPaginatedResponse<IEquipment[]>,
      {
        companyId: string;
        params?: {
          search?: string | null;
          source?: string | null;
          type?: string | null;
          country?: string | null;
          storage?: string | null;
          memory?: string | null;
          status?: string | null;
          assigned?: boolean | null;
          page?: number;
          per_page?: number;
          refresh_status?: boolean | null;
          assignee_country?: string | null;
          office_id?: string;
          subsidiary_id?: string;
        };
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/equipments`,
        params,
      }),
      providesTags: ["Equipment"],
    }),
  }),
});

export const { useGetEquipmentsQuery, useLazyGetEquipmentsQuery } =
  getEquipments;
