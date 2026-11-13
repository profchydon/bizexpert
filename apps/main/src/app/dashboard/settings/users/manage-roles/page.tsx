import { isBizExpertApp } from "@/config/product";
import { DashboardSectionPlaceholder } from "@/components/bizexpert/DashboardSectionPlaceholder";
import BizExpertSettings from "@/container/Dashboard/BizExpertSettings";

export default function ManageRolesPage() {
  if (isBizExpertApp()) return <BizExpertSettings />;
  return (
    <DashboardSectionPlaceholder
      title="Roles"
      description="Default access levels for this business."
    />
  );
}
