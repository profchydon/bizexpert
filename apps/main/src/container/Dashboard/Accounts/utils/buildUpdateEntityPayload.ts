import type { UpdateEntityRequest } from "@/api/baseQueries/companiesApi/entitiesApi/types";

export type UpdateEntityFormValues = {
  name: string;
  isPrimary: boolean;
};

export function buildUpdateEntityPayload(
  values: UpdateEntityFormValues,
): UpdateEntityRequest {
  if (values.isPrimary) {
    return {};
  }

  return {
    name: values.name.trim(),
  };
}
