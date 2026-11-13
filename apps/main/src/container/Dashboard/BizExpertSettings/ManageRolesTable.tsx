"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import routes from "@/routes";
import { locationsQueryKeys } from "../Locations/locationsQueryKeys";
import { SalesTableActions } from "../Sales/tableActions";
import type { BusinessMember } from "@/types/bizexpert";
import { buildManageRoleRows, filterManageRoles } from "./defaultBusinessRoles";
import { manageRoleColumns } from "./manageRoleColumns";
import {
  settingsTableCountBadgeClass,
  settingsTableShellClass,
  settingsTableTitleClass,
  settingsTableToolbarClass,
} from "./settingsPageClasses";

type Props = {
  businessId: string;
};

export function ManageRolesTable({ businessId }: Props) {
  const { push, isPending } = useTransitionRouter();
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: locationsQueryKeys.members(businessId),
    queryFn: async () =>
      (await bizexpertApi.get(`/businesses/${businessId}/members`))
        .data as BusinessMember[],
  });

  const members = data ?? [];
  const rows = useMemo(
    () => filterManageRoles(buildManageRoleRows(members), search),
    [members, search],
  );

  const columns = useMemo(
    () =>
      manageRoleColumns({
        renderActions: (item) => (
          <SalesTableActions
            isNavigating={isPending && activeId === item.id}
            onView={() => {
              setActiveId(item.id);
              push(routes.SETTINGS_ROLE(item.id));
            }}
          />
        ),
      }),
    [activeId, isPending, push],
  );

  return (
    <div className={settingsTableShellClass}>
      <div className={settingsTableToolbarClass}>
        <h2 className={settingsTableTitleClass}>
          Roles
          <span className={settingsTableCountBadgeClass}>{rows.length}</span>
        </h2>
        <SearchWithIcon
          className="w-[250px]"
          placeholder="Search roles"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={rows}
          columns={columns}
          paginationClassName={referenceTablePaginationClass}
        />
      </PageState>
    </div>
  );
}
