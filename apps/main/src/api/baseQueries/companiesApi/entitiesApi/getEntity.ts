import { companiesApi } from "..";
import type { EntityDetailApiRecord } from "./entityDetailTypes";

const getEntity = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getEntity: query.query<
      ServerResponse<EntityDetailApiRecord>,
      { entityId: string }
    >({
      query: ({ entityId }) => ({
        url: `/${entityId}`,
      }),
      providesTags: (result, error, { entityId }) => [
        { type: "Entities", id: entityId },
        "Entities",
      ],
    }),
  }),
});

export const { useGetEntityQuery, useLazyGetEntityQuery } = getEntity;
