import { isBizExpertApp } from "@/config/product";
import { DashboardSectionPlaceholder } from "@/components/bizexpert/DashboardSectionPlaceholder";
import { RolePermissions } from "@/container/Dashboard/BizExpertSettings/RolePermissions";

export default function RolePermissionsPage() {
  if (isBizExpertApp()) return <RolePermissions />;
  return (
    <DashboardSectionPlaceholder
      title="Role permissions"
      description="Authorized and unauthorized access for this role."
    />
  );
}
