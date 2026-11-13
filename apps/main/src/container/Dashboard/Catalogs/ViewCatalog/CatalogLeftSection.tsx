import React, { useState } from "react";
import LeftSectionItem from "./LeftSectionItem";
import { Badge } from "@/components/ui/badge";
import ReactCountryFlag from "react-country-flag";
import {
  building,
  calculator,
  tag,
  bazier_curve,
  bank_note,
} from "@/assets/icons";
import formatAmount from "@/utils/formatAmount";
import { ICatalog } from "@/types/catalog";
import useCatalog from "@/hooks/useCatalog";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CatalogLeftSection: React.FC<{ catalog?: ICatalog }> = ({ catalog }) => {
  const [showAllCountries, setShowAllCountries] = useState(false);
  const { lowerBoundaryTotal } = useCatalog(catalog!);
  const currencySymbol = useWorkspaceCurrencySymbol();

  return (
    catalog && (
      <div className="lg:flex lg:flex-col gap-8 sm:gap-6 grid grid-cols-2 sm:grid-cols-5">
        {catalog.type === "budget" && (
          <LeftSectionItem
            title="Budget Amount"
            description={
              catalog.config?.budget_limit ? (
                `${currencySymbol}${formatAmount(catalog.config.budget_limit)}`
              ) : (
                <Badge variant="red">Not available</Badge>
              )
            }
            icon={bank_note}
          />
        )}

        <div className="flex flex-row items-center">
          <LeftSectionItem
            title="Department"
            description={
              catalog.departments.length > 0 ? (
                catalog.departments.map((dept) => dept.name).join(", ")
              ) : (
                <Badge variant="red">Not available</Badge>
              )
            }
            icon={building}
          />
        </div>

        <LeftSectionItem
          title="Level"
          description={
            catalog.levels.length > 0 ? (
              catalog.levels.map((level) => level.name).join(", ")
            ) : (
              <Badge variant="red">Not available</Badge>
            )
          }
          icon={tag}
        />

        {catalog.type !== "budget" && (
          <LeftSectionItem
            title="Items count"
            description={
              catalog.asset_count === 0 ? "No items yet" : catalog.asset_count
            }
            icon={calculator}
          />
        )}

        {catalog.type !== "budget" && (
          <LeftSectionItem
            title="Price"
            description={
              lowerBoundaryTotal != null &&
              catalog?.config?.budget_limit != null ? (
                `${currencySymbol} ${lowerBoundaryTotal} - ${catalog.config.budget_limit}`
              ) : (
                <Badge variant="red">Not available</Badge>
              )
            }
            icon={bazier_curve}
          />
        )}

        <div className="col-span-2 sm:col-span-3">
          <LeftSectionItem
            title="Country"
            description={
              catalog.countries && catalog.countries.length > 0 ? (
                <div className="flex flex-col gap-y-2">
                  {catalog.countries.slice(0, 3).map((country) => (
                    <div key={country.id} className="flex items-center gap-x-2">
                      <ReactCountryFlag
                        countryCode={country.code ?? ""}
                        svg
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                        }}
                      />
                      <span>{country.name}</span>
                    </div>
                  ))}
                  {catalog.countries.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllCountries(true)}
                      className="flex items-center gap-x-2 mt-1 hover:bg-gray-50 rounded-md px-2 py-1 -ml-2 transition-colors"
                    >
                      <div className="flex -space-x-1">
                        {catalog.countries.slice(3, 6).map((country) => (
                          <ReactCountryFlag
                            key={country.id}
                            countryCode={country.code ?? ""}
                            svg
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              border: "1px solid white",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-primary-600 font-medium hover:underline">
                        +{catalog.countries.length - 3} more countries
                      </span>
                    </button>
                  )}
                </div>
              ) : catalog.country ? (
                <div className="flex items-center gap-x-2">
                  <ReactCountryFlag
                    countryCode={catalog.country.code ?? ""}
                    svg
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  />
                  <span>{catalog.country.name}</span>
                </div>
              ) : (
                <Badge variant="red">Not available</Badge>
              )
            }
            icon={null}
          />
        </div>
        <LeftSectionItem
          title="Status"
          description={
            <>
              {catalog.status === "active" && (
                <Badge variant="success" className=" w-14 text-success-700">
                  Active
                </Badge>
              )}
              {catalog.status !== "active" && (
                <Badge
                  variant="pending"
                  className="bg-gray-200 w-16 text-gray-700"
                >
                  Pending
                </Badge>
              )}
            </>
          }
          icon={null}
        />

        <Dialog
          open={showAllCountries}
          onOpenChange={setShowAllCountries}
          data-testid="catalogleftsection-dialog"
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                All Countries ({catalog.countries?.length ?? 0})
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {catalog.countries?.map((country) => (
                  <div
                    key={country.id}
                    className="flex items-center gap-x-2 py-1"
                  >
                    <ReactCountryFlag
                      countryCode={country.code ?? ""}
                      svg
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                      }}
                    />
                    <span className="text-sm text-gray-700 truncate">
                      {country.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  );
};

export default CatalogLeftSection;
