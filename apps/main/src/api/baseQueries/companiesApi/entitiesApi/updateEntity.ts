import { companiesApi } from "..";
import type { EntityDetailApiRecord } from "./entityDetailTypes";
import type { UpdateEntityRequest } from "./types";

const updateEntity = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateEntity: build.mutation<
      ServerResponse<EntityDetailApiRecord>,
      { entityId: string; body: UpdateEntityRequest }
    >({
      query: ({ entityId, body }) => ({
        url: `/${entityId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (result, error, { entityId }) => [
        "Entities",
        { type: "Entities", id: entityId },
      ],
    }),
  }),
});

export const { useUpdateEntityMutation } = updateEntity;
