import React from "react";
import ListItem from "./ListItem";
import ReactCountryFlag from "react-country-flag";
import { IEmployees } from "@/types/employees";
import { Badge } from "@/components/ui/badge";

interface I_ListData {
  title: string;
  countryCode?: string;
  description: string | React.ReactNode;
}

interface Props {
  employeeData: IEmployees | undefined;
}
const ListLayout: React.FC<Props> = ({ employeeData }) => {
  const listData: I_ListData[] = [
    {
      title: "Line Manager",
      description: employeeManagerName(employeeData?.manager) ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Country",
      countryCode: employeeData?.country_code,
      description: employeeData?.country ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Role",
      description: employeeData?.job_title ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "National ID/Tax Number",
      description: employeeData?.tax_number ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Department",
      // @ts-ignore
      description: employeeData?.departments?.[0]?.name ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Level",
      description: employeeData?.level ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Work email",
      description: employeeData?.email ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Personal email",
      description: employeeData?.personal_email ?? (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Phone number",
      description: employeeData?.phone || (
        <Badge variant="red">Not available</Badge>
      ),
    },
    {
      title: "Address",
      description: employeeData?.address || (
        <Badge variant="red">Not available</Badge>
      ),
    },
  ];
  return (
    <div className="mt-6 flex flex-col gap-6">
      {listData?.map((item) => {
        const { title, countryCode, description } = item;

        if (!countryCode) {
          return <ListItem title={title} description={description} />;
        }
        return (
          <ListItem
            title={title}
            description={
              <div className="flex items-center gap-x-2">
                <ReactCountryFlag
                  countryCode={countryCode}
                  className=""
                  svg
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
                <span>{description}</span>
              </div>
            }
          />
        );
      })}
    </div>
  );
};

export default ListLayout;

function employeeManagerName(manager?: Partial<IEmployees> | null) {
  if (!manager) return undefined;
  return (
    [manager.first_name, manager.last_name].filter(Boolean).join(" ") ||
    manager.email
  );
}
