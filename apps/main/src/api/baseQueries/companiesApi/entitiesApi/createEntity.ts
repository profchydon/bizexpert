import { companiesApi } from "..";
import type { CreateEntityData, CreateEntityRequest } from "./types";

const createEntity = companiesApi.injectEndpoints({
  endpoints: (mutation) => ({
    createEntity: mutation.mutation<
      ServerResponse<CreateEntityData>,
      { companyId: string; body: CreateEntityRequest }
    >({
      query: ({ companyId, body }) => ({
        url: `/${companyId}/entities`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Entities"],
    }),
  }),
});

export const { useCreateEntityMutation } = createEntity;
