import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { removeUserscore } from "@/utils/underScoreTransformer";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";
import React, { FC } from "react";
import ReactCountryFlag from "react-country-flag";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  title: string;
  description: string;
  country: unknown;
  country_code?: unknown;
  address: string;
  employment_type: string;
  name: string;
  email: string;
  phone: string;
  collectionDate?: string;
  expirationDate?: string;
}

const AddressCard: FC<Props> = (props) => {
  const {
    title,
    description,
    country,
    country_code,
    address,
    employment_type,
    name,
    email,
    phone,
    collectionDate,
    expirationDate,
  } = props;

  const countryLabel = resolveCountryText(country) ?? "";
  const countryCode = resolveCountryCode(country_code, country) ?? "";

  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-gray-900 text-2xl font-medium">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <Separator className="my-5" />
      <CardContent className="p-0 grid gap-4">
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
        {collectionDate && (
          <ListCard
            title="Estimated pick-up date"
            description={collectionDate || ""}
          />
        )}
        {expirationDate && (
          <ListCard
            title="Estimated pick-up date"
            description={expirationDate || ""}
          />
        )}

        <ListCard
          className="col-span-2"
          title="Address"
          description={address || ""}
        />
        <Separator className="col-span-2" />
        <ListCard title="Full Name" description={name || ""} />
        <ListCard title="Email address" description={email || ""} />
        <ListCard
          title="Employee Type"
          description={
            removeUserscore(employment_type || "") || (
              <Badge variant="red">Not available</Badge>
            )
          }
        />
        <ListCard title="Phone Number" description={phone || ""} />
      </CardContent>
    </Card>
  );
};

export default AddressCard;
