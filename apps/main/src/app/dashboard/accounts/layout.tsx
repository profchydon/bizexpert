import AccountManagementRouteGuard from "@/components/AccountManagementRouteGuard";

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountManagementRouteGuard>{children}</AccountManagementRouteGuard>;
}
