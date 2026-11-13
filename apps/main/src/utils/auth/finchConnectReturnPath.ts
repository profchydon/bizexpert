import { appendEntityWorkspaceParam } from "@/utils/workspace/activeWorkspace";
import { readEntityFromLocationSearch } from "./integrationConnectCookies";

export function finchConnectReturnPath(input: {
  returnTo?: string;
  pathname: string;
  search: string;
}): string {
  const entity = readEntityFromLocationSearch(input.search);

  if (input.returnTo === "employees") {
    return appendEntityWorkspaceParam("/dashboard/employees?tab=hris", entity);
  }

  const params = new URLSearchParams(
    input.search.startsWith("?") ? input.search.slice(1) : input.search,
  );
  params.delete("integration");
  params.delete("integration_id");
  params.delete("code");
  params.delete("service");
  if (entity) {
    params.set("entity", entity);
  }

  const query = params.toString();
  return `${input.pathname}${query ? `?${query}` : ""}`;
}
