import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import { removeUserscore } from "@/utils/underScoreTransformer";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import React, { FC } from "react";
import ReactCountryFlag from "react-country-flag";

interface ListCardProps {
  title: string;
  description: string | React.ReactNode;
  className?: string;
}
const ListCard: FC<ListCardProps> = ({ title, description, className }) => {
  return (
    <div className={cn("flex flex-col gap-y-1", className)}>
      <p className="text-gray-500 text-sm font-semibold">{title}</p>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
};

interface Props {
  data?: IEmployees;
}
const DeliveryAddress: FC<Props> = ({ data }) => {
  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-gray-900 text-2xl font-medium">
          Delivery address
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          Shared with our logistics partners.
        </CardDescription>
      </CardHeader>
      <Separator className="my-5" />
      <CardContent className="p-0 grid grid-cols-2 gap-4">
        <ListCard
          title="Country"
          description={
            <div className="flex items-center gap-x-2">
              {data?.country_code && (
                <ReactCountryFlag
                  countryCode={data?.country_code || ""}
                  className=""
                  svg
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              )}
              <span>{data?.country || ""}</span>
            </div>
          }
        />
        <ListCard
          className="col-span-2"
          title="Address"
          description={data?.address || ""}
        />
        <Separator className="col-span-2" />
        <ListCard
          title="Full Name"
          description={`${data?.first_name || ""} ${data?.last_name || ""}`}
        />
        <ListCard title="Email address" description={data?.email || ""} />
        <ListCard
          title="Employee Type"
          description={removeUserscore(data?.employment_type || "") || ""}
        />
        <ListCard title="Phone Number" description={data?.phone || ""} />
      </CardContent>
    </Card>
  );
};

export default DeliveryAddress;
