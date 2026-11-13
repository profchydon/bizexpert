import { companiesApi } from "..";

const closeEntity = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    closeEntity: build.mutation<ServerResponse<unknown>, { entityId: string }>({
      query: ({ entityId }) => ({
        url: `/${entityId}/close`,
        method: "POST",
        data: {},
      }),
      invalidatesTags: (result, error, { entityId }) => [
        "Entities",
        { type: "Entities", id: entityId },
        "Offices",
      ],
    }),
  }),
});

export const { useCloseEntityMutation } = closeEntity;
