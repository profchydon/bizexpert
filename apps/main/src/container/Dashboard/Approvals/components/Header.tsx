import PageHeader from "@/components/PageHeader";
import routes from "@/routes";

export function ApprovalsHeader() {
  return (
    <PageHeader
      pageTitle="Approvals"
      pageDescription="Review onboarding kits before orders are placed."
      breadCrumbs={["Approvals"]}
    />
  );
}
