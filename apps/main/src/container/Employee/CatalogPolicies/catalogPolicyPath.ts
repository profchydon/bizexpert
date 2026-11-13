export function getEmployeeCatalogPolicyIdFromPathname(pathname: string) {
  const [, root, segment, catalogId, ...rest] = pathname.split("/");
  const isEmployeeCatalogPolicy =
    root === "employee" &&
    segment === "catalog-policies" &&
    Boolean(catalogId) &&
    rest.length === 0;

  return isEmployeeCatalogPolicy ? catalogId : "";
}
