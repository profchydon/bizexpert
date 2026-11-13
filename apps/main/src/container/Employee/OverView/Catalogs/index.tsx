import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Link, { type LinkProps } from "next/link";
import routes from "@/routes";
import type { ICatalog } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import type { IEmployeeCatalogPolicy } from "@/types/employees";
import { catalogPolicyDetailTabs } from "../../CatalogPolicies/catalogPolicyTabs";

type CatalogCardItem = Pick<ICatalog, "id" | "name"> &
  Partial<Pick<ICatalog, "levels" | "departments">> &
  Pick<
    Partial<IEmployeeCatalogPolicy>,
    "selection_mode" | "approval_type" | "kits"
  >;

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const Catalogs: React.FC<{
  catalogs: CatalogCardItem[];
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  hrefBase?: string;
  showOrderLink?: boolean;
}> = ({
  catalogs,
  title = "Catalogs",
  description = "Your recent catalogs here",
  emptyTitle = "No catalogs assigned yet",
  emptyDescription = "You don’t have any catalog assigned to you yet.",
  hrefBase = routes.EMPLOYEE_CATALOGS,
  showOrderLink = false,
}) => {
  const { removeAllItemsFromCart } = useCart();
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg text-gray-900 font-semibold">{title}</h2>
          <span className="text-sm">{description}</span>
        </div>
        {/* <Link href={routes.EMPLOYEE_ASSETS}>
          <Button>All catalogs</Button>
        </Link> */}
      </div>

      {catalogs.length > 0 && (
        <div>
          <Separator className="my-8" />

          <div className="grid grid-cols-3 gap-6">
            {catalogs.map((catalog) => (
              <Card key={catalog.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-y-2">
                    <div className=" flex flex-col gap-y-1">
                      <span className="text-gray-900 text-base font-medium">
                        {catalog.name}
                      </span>
                      <span></span>
                    </div>

                    <div className="flex gap-x-2 items-center">
                      {catalog.selection_mode ? (
                        <Badge variant="blue">
                          {titleCase(catalog.selection_mode)}
                        </Badge>
                      ) : null}
                      {catalog.approval_type ? (
                        <Badge variant="blue">
                          {titleCase(catalog.approval_type)}
                        </Badge>
                      ) : null}
                      {catalog.kits?.data?.[0]?.name ? (
                        <Badge variant="blue">
                          {catalog.kits.data[0].name}
                        </Badge>
                      ) : null}
                      {catalog?.levels && !catalog.selection_mode && (
                        <Badge variant={"blue"}>
                          {catalog?.levels?.[0]?.name ?? (
                            <Badge variant="red">Not available</Badge>
                          )}
                        </Badge>
                      )}
                      {(!catalog.selection_mode &&
                        catalog?.departments &&
                        catalog?.departments?.map((dept) => (
                          <Badge key={dept.id} variant={"blue"}>
                            {dept.name}
                          </Badge>
                        ))) ||
                        (!catalog.selection_mode ? (
                          <Badge variant="red">Not available</Badge>
                        ) : null)}
                    </div>

                    <div className="flex flex-col gap-y-1">
                      {/* <div className="text-gray-600 font-medium text-sm">
                        Total budget count
                      </div> */}
                      {/* <div className="w-fit">
                        <Badge variant={"blue"}>
                          {catalog?.config ? (
                            catalog?.config.budget_count
                          ) : (
                            <Badge variant="red">Not available</Badge>
                          )}
                        </Badge>
                      </div> */}
                    </div>
                  </div>
                </CardContent>

                <CardFooter
                  className={
                    showOrderLink
                      ? "grid grid-cols-2 gap-3 border-t p-4"
                      : "grid place-content-center border-t p-4"
                  }
                >
                  <CatalogActionLink
                    href={{ pathname: `${hrefBase}/${catalog.id}` }}
                    label="View Catalog"
                    onClick={removeAllItemsFromCart}
                    variant="primary"
                  />
                  {showOrderLink ? (
                    <CatalogActionLink
                      href={{
                        pathname: `${hrefBase}/${catalog.id}`,
                        query: { tab: catalogPolicyDetailTabs.orderRequests },
                      }}
                      label="View Order"
                      onClick={removeAllItemsFromCart}
                      variant="secondary"
                    />
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {catalogs.length === 0 && (
        <EmptyTableInstance description={emptyDescription} title={emptyTitle} />
      )}
    </div>
  );
};

export default Catalogs;

function CatalogActionLink({
  href,
  label,
  onClick,
  variant,
}: {
  href: LinkProps["href"];
  label: string;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  return (
    <Button
      asChild
      className="w-full text-sm"
      size="sm"
      variant={variant}
      data-testid="catalogs-button"
    >
      <Link href={href} onClick={onClick}>
        {label}
      </Link>
    </Button>
  );
}
