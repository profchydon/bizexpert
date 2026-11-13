import {
  settingsTableCountBadgeClass,
  settingsTableShellClass,
  settingsTableTitleClass,
  settingsTableToolbarClass,
} from "./settingsPageClasses";
import type {
  PermissionGroup,
  RolePermission,
} from "./rolePermissions/permissionTypes";

type Group = {
  group: PermissionGroup;
  items: RolePermission[];
};

type Props = {
  title: string;
  groups: Group[];
  tone: "authorized" | "unauthorized";
};

export function RolePermissionColumn({ title, groups, tone }: Props) {
  const count = groups.reduce((sum, group) => sum + group.items.length, 0);
  const itemClass =
    tone === "authorized"
      ? "text-sm text-success-700"
      : "text-sm text-gray-600";

  return (
    <div className={settingsTableShellClass}>
      <div className={settingsTableToolbarClass}>
        <h2 className={settingsTableTitleClass}>
          {title}
          <span className={settingsTableCountBadgeClass}>{count}</span>
        </h2>
      </div>
      <div className="flex flex-col gap-5 px-6 py-5">
        {groups.length === 0 ? (
          <p className="text-sm text-gray-600">None</p>
        ) : (
          groups.map((entry) => (
            <section key={entry.group} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {entry.group}
              </h3>
              <ul className="flex flex-col gap-1">
                {entry.items.map((item) => (
                  <li key={item.id} className={itemClass}>
                    {item.label}
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
