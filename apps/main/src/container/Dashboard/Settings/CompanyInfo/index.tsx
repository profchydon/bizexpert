"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryState } from "nuqs";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { buildCompanyFields } from "./companyInfoFields";

const CompanyInfo = () => {
  const [, setSettingTab] = useQueryState("settingsType");
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const fields = buildCompanyFields(company ?? {});

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-gray-900">
            {company?.name}
          </h2>
          <span className="text-sm font-medium text-primary-700">
            {company?.address || "Not set"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex cursor-not-allowed">
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="h-max gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold"
                    data-testid="companyinfo-button"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Coming soon</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            className="h-max rounded-lg px-3.5 py-2.5 text-sm font-semibold"
            onClick={() => setSettingTab("support")}
            data-testid="companyinfo-button-2"
          >
            Support
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-600">{field.label}</span>
            {field.badge ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-fit cursor-default">
                    <span className="flex size-max items-center whitespace-nowrap rounded-full bg-primary-50 px-2.5 py-0.5 text-sm font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
                      {field.value}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{field.badgeTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span
                className={
                  field.muted
                    ? "text-sm text-gray-600"
                    : "text-sm font-medium text-primary-700"
                }
              >
                {field.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInfo;
