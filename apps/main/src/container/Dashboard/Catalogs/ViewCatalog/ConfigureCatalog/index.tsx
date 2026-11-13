import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import DrawerRight from "@/components/DrawerRight";
import Loader from "@/components/Loader";

import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { ICatalog } from "@/types/catalog";
import useCatalog from "@/hooks/useCatalog";
import { useAddCatalogConfigMutation } from "@/api/baseQueries/companiesApi/catalogsApi/addCatalogConfig";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { handleUnexpectedAsyncError } from "@/utils/handleUnexpectedAsyncError";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useUpdateCatalogConfigMutation } from "@/api/baseQueries/companiesApi/catalogsApi/updateCatalogConfig";
import Link from "next/link";
import routes from "@/routes";
import formatAmount from "@/utils/formatAmount";

interface Props {
  isOpen: boolean;
  catalog?: ICatalog;
  onClose: () => void;
  onOpenQtyConfig: () => void;
}

const ConfigureCatalog: React.FC<Props> = ({
  isOpen,
  onClose,
  catalog: catalogData,
  onOpenQtyConfig,
}) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);
  const companyId = useWorkspaceCompanyId();

  const [automaticSharing, setAutomaticSharing] = useState(false);
  const [autoApproval, setAutoApproval] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [timeDuration, setTimeDuration] = useState("days");
  const [budgetLimit, setBudgetLimit] = useState("");

  const { data: catalogRes, isLoading } = useGetCatalogQuery(
    {
      catalogId: catalogData?.id!,
      companyId: companyId!,
    },
    { skip: !catalogData },
  );
  const catalog = catalogRes?.data;

  const { totalAssetAmountRange, lowerBoundaryTotal, upperBoundaryTotal } =
    useCatalog(catalog!);

  const [addCatalogConfig, addCatalogConfigProps] =
    useAddCatalogConfigMutation();
  const [updateCatalogConfig, updateCatalogConfigProps] =
    useUpdateCatalogConfigMutation();

  const handleAddCatalog = async () => {
    try {
      const config = catalog?.config;
      const payload = {
        catalogId: catalog?.id!,
        companyId: companyId!,
        auto_share: automaticSharing,
        auto_approve: autoApproval,
        budget_limit: budgetLimit,
        time_limit: timeLimit,
        time_duration: timeDuration,
      };
      if (!config) {
        const res = await addCatalogConfig(payload);
        if (res.data?.data) {
          displaySuccessMessage("Configuration added successfully");
          onClose();
        }
      } else {
        const res = await updateCatalogConfig(payload);
        if (res.data?.data) {
          displaySuccessMessage("Configuration updated successfully");
          onClose();
        }
      }
    } catch (error) {
      handleUnexpectedAsyncError(error, "Unable to save catalog configuration");
    }
  };

  useEffect(() => {
    const config = catalog?.config;
    if (config) {
      setBudgetLimit(config.budget_limit);
      setAutomaticSharing(config.auto_share);
      setAutoApproval((config as any)?.auto_approve);
      setTimeDuration(config.time_duration);

      if (config.time_duration === "days") {
        setTimeLimit((config.time_limit / 1440).toString());
      }
      if (config.time_duration === "weeks") {
        setTimeLimit((config.time_limit / 10080).toString());
      }
      if (config.time_duration === "months") {
        setTimeLimit(Math.round(config.time_limit / 43800).toString());
      }
    }
  }, [catalog?.config]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        drawerTitle={
          catalogData?.type === "budget"
            ? "Configure Budget Catalog"
            : "Configure Device Catalog"
        }
        drawerDescription="Customize the catalog to meet the unique needs of your team."
        hideDefaultFooterBtn
        data-testid="configurecatalog-drawerright"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader width="32" height="32" />
          </div>
        ) : (
          <div className="flex flex-col gap-y-6 mb-[70px]">
            {catalogData?.type === "budget" && (
              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-medium">Budget amount *</label>
                <Input
                  placeholder="Enter Amount"
                  className="flex-1"
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) >= 0) {
                      setBudgetLimit(value);
                    }
                  }}
                  min={0}
                  startAdornment={
                    <span className="text-gray-500">{billingSymbol}</span>
                  }
                  data-testid="configurecatalog-input"
                />
              </div>
            )}

            {catalogData?.type !== "budget" && (
              <>
                <Card className="cursor-pointer" onClick={onOpenQtyConfig}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-x-2">
                      <div className="flex flex-col gap-y-1">
                        <p className="font-medium text-base text-gray-600">
                          Items quantity
                        </p>
                        <span className="text-sm">
                          Adjust the quantity each of item an employee can pick
                        </span>
                      </div>

                      <Button
                        variant={"outline"}
                        className="bg-primary-50 border-0 p-2"
                        data-testid="configurecatalog-button"
                      >
                        <ArrowRight className="text-primary-700" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Separator />
              </>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-x-2">
                  <Switch
                    onCheckedChange={(value) => setAutomaticSharing(value)}
                    checked={automaticSharing}
                  />
                  <div className="flex flex-col gap-y-1">
                    <p className="font-medium text-sm text-gray-600">
                      Automatic sharing
                    </p>
                    <span className="text-sm">
                      Enable automatic sharing for remote teams.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-x-2">
                  <Switch
                    onCheckedChange={(value) => setAutoApproval(value)}
                    checked={autoApproval}
                    data-testid="configurecatalog-auto-approval-switch"
                  />
                  <div className="flex flex-col gap-y-1">
                    <p className="font-medium text-sm text-gray-600">
                      Auto-approval
                    </p>
                    <span className="text-sm">
                      Requests are approved automatically without manual review.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex flex-col">
              <div>
                <h4 className="text-sm font-medium">Time limit</h4>
                <span className="text-sm font-normal">
                  Set a time limit for catalog access.
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-row gap-x-2">
                <Input
                  value={timeLimit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) >= 0) {
                      setTimeLimit(e.target.value);
                    }
                  }}
                  min={0}
                  placeholder="Enter time"
                  className="flex-1"
                  type="number"
                  endAdornment={
                    <Select
                      value={timeDuration}
                      onValueChange={(value) => setTimeDuration(value)}
                      data-testid="configurecatalog-select"
                    >
                      <SelectTrigger className="border-t border-r-0 border-l-0">
                        <SelectValue placeholder="Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                  data-testid="configurecatalog-input-2"
                />
              </div>
            </div>

            {catalogData?.type !== "budget" && (
              <>
                <div>
                  <h4 className="text-sm font-medium">Budget limit</h4>
                  <span className="font-normal text-sm">
                    {" "}
                    {totalAssetAmountRange &&
                      !catalog?.config?.budget_limit && (
                        <>
                          The estimated price for each employee is{" "}
                          <strong>{totalAssetAmountRange}</strong>. Do you want
                          to update the limit?
                        </>
                      )}
                    {totalAssetAmountRange && catalog?.config?.budget_limit && (
                      <>
                        The estimated price for each employee is{" "}
                        <strong>
                          {formatAmount(catalog?.config?.budget_limit)}
                        </strong>
                        . Do you want to update the limit?
                      </>
                    )}
                    {!totalAssetAmountRange && (
                      <>
                        The estimated price for each employee is unavailable.{" "}
                        <Link
                          href={`${routes.CATALOGS_MARKETPLACE}?catalogId=${catalog?.id}`}
                          className="text-primary-700 underline cursor-pointer"
                        >
                          Add items
                        </Link>{" "}
                        to view the price range and update budget limit.
                      </>
                    )}
                  </span>
                </div>
                {totalAssetAmountRange && (
                  <Input
                    placeholder="Enter Amount"
                    className="flex-1"
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (Number(value) >= 0) {
                        setBudgetLimit(value);
                      }
                    }}
                    min={0}
                    data-testid="configurecatalog-input-3"
                  />
                )}
              </>
            )}
          </div>
        )}

        <DrawerFooter
          onClose={onClose}
          submitButtonType="button"
          onSubmit={handleAddCatalog}
          disableSubmitButton={
            !budgetLimit ||
            addCatalogConfigProps.isLoading ||
            updateCatalogConfigProps.isLoading
          }
          saveText="Save"
        />
      </DrawerRight>
    </div>
  );
};

export default ConfigureCatalog;
