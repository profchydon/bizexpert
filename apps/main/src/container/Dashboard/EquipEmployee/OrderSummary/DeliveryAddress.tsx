import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IEmployees } from "@/types/employees";
import { removeUserscore } from "@/utils/underScoreTransformer";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";
import { HelpCircle } from "lucide-react";
import React, { FC } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  formatPreferredDate,
  PREFERRED_DATE_HELP,
  showPreferredDeliveryDate,
} from "./formatPreferredDate";

interface ListCardProps {
  title: string;
  description: string | React.ReactNode;
  className?: string;
  help?: { title: string; description: string };
}
const ListCard: FC<ListCardProps> = ({
  title,
  description,
  className,
  help,
}) => {
  return (
    <div className={cn("flex flex-col gap-y-1", className)}>
      <div className="flex items-center gap-1">
        <p className="text-gray-500 text-sm font-semibold">{title}</p>
        {help && (
          <Tooltip
            title={help.title}
            description={help.description}
            placement="top"
          >
            <TooltipTrigger
              className="cursor-default text-gray-400 hover:text-gray-500"
              aria-label={`About ${title}`}
            >
              <HelpCircle className="h-4 w-4" />
            </TooltipTrigger>
          </Tooltip>
        )}
      </div>
      <div className="text-gray-700 text-sm">{description}</div>
    </div>
  );
};

interface Props {
  data?: IEmployees;
}
const DeliveryAddress: FC<Props> = ({ data }) => {
  const countryLabel = resolveCountryText(data?.country) ?? "";
  const countryCode =
    resolveCountryCode(data?.country_code, data?.country) ?? "";
  const isOfficeDelivery = Boolean(
    data?.office_id || data?.destination_type === "office",
  );

  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-gray-900 text-2xl font-medium">
          Delivery address
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          {isOfficeDelivery
            ? "This equipment belongs to the office. Shared with our logistics partners."
            : "Shared with our logistics partners."}
        </CardDescription>
      </CardHeader>
      {isOfficeDelivery && (
        <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
          <p className="text-sm font-semibold text-primary-800">
            The office address is fixed
          </p>
          <p className="mt-1 text-sm text-primary-700">
            Change it in Account management. Contact phone, date, and delivery
            instructions can still be edited for this delivery.
          </p>
        </div>
      )}
      <Separator className="my-5" />
      <CardContent className="p-0 grid grid-cols-2 gap-4">
        {isOfficeDelivery && data?.office?.name && (
          <ListCard
            className="col-span-2"
            title="Office"
            description={data.office.name}
          />
        )}
        <ListCard
          title="Country"
          description={
            <div className="flex items-center gap-x-2">
              {countryCode && (
                <ReactCountryFlag
                  countryCode={countryCode}
                  className=""
                  svg
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              )}
              <span>{countryLabel}</span>
            </div>
          }
        />
        {showPreferredDeliveryDate(data?.destination_type) && (
          <ListCard
            title="Preferred delivery date"
            help={PREFERRED_DATE_HELP}
            description={
              formatPreferredDate(data?.fulfilment_date) ?? (
                <span className="text-gray-400">Not set</span>
              )
            }
          />
        )}
        <ListCard
          className="col-span-2"
          title={isOfficeDelivery ? "Office address" : "Address"}
          description={data?.address || ""}
        />
        <Separator className="col-span-2" />
        <ListCard
          title={isOfficeDelivery ? "Delivery contact" : "Full Name"}
          description={`${data?.first_name || ""} ${data?.last_name || ""}`}
        />
        <ListCard
          title={isOfficeDelivery ? "Contact email" : "Email address"}
          description={data?.email || ""}
        />
        <ListCard
          title={isOfficeDelivery ? "Role" : "Employee Type"}
          description={removeUserscore(data?.employment_type || "") || ""}
        />
        <ListCard
          title={isOfficeDelivery ? "Contact phone" : "Phone Number"}
          description={data?.phone || ""}
        />
      </CardContent>
    </Card>
  );
};

export default DeliveryAddress;
