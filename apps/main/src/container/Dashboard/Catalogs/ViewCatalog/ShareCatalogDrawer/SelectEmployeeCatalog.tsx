import React, { useState } from "react";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFilterByEmploymentType from "@/hooks/useFilterByEmploymentType";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { IEmployees } from "@/types/employees";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import PageState from "@/components/PageState";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useShareCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/shareCatalog";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { ICatalog } from "@/types/catalog";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { handleUnexpectedAsyncError } from "@/utils/handleUnexpectedAsyncError";
import ReactCountryFlag from "react-country-flag";
import SearchWithIcon from "@/components/SearchWithIcon";
import { useDebounce } from "use-debounce";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";

interface Props {
  onClose: () => void;
  catalog?: ICatalog;
}

const SelectEmployeeCatalog: React.FC<Props> = ({ onClose, catalog }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const catalogId = catalog?.id;

  const { data: catalogRes } = useGetCatalogQuery(
    { catalogId: catalog?.id!, companyId: companyId! },
    { skip: !catalogId },
  );
  const catalogDetail = catalogRes?.data;

  const [search, setSearch] = useState<string | null>(null);
  const [searchValue] = useDebounce(search, 300);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");

  const {
    data: getEmployees,
    isLoading,
    isError,
  } = useGetEmployeesQuery(
    {
      companyId: companyId!,
      params: {
        search: searchValue ?? null,
        paginate: false,
      },
    },
    { skip: !companyId },
  );

  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const employeeData = getEmployees?.data?.data;

  const [employmentType, setEmploymentType] = useState<string>("");

  // Get catalog countries for the dropdown
  const catalogCountries = catalogDetail?.countries || [];

  // Set default country when catalog loads
  React.useEffect(() => {
    if (catalogCountries.length > 0 && !selectedCountryCode) {
      setSelectedCountryCode(catalogCountries[0]?.code || "");
    }
  }, [catalogCountries, selectedCountryCode]);

  const [shareCatalog, shareCatalogProps] = useShareCatalogMutation();

  const onSubmit = async () => {
    try {
      if (selectedValue.length > 0) {
        const res = await shareCatalog({
          companyId: companyId!,
          catalogId: catalogDetail?.id!,
          emails: selectedValue,
        });
        const success = res.data?.success;
        if (success) {
          displaySuccessMessage("Users invited successfully");
          setSelectedValue([]);
          onClose();
        }
      }
    } catch (error) {
      handleUnexpectedAsyncError(error, "Unable to share catalog");
    }
  };

  const filteredEmployees = useFilterByEmploymentType(
    employeeData,
    employmentType,
  ) as IEmployees[];

  const handleSelection = (value: string[]) => {
    setSelectedValue(value);
  };

  // Filter employees by selected catalog country
  const newFilteredEmployees = filteredEmployees?.filter(
    (employee) => employee?.country_code === selectedCountryCode,
  );

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="space-y-5 mt-8 mb-[76px] px-0">
        <SearchWithIcon
          placeholder="Search employee"
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
        />

        {catalogCountries.length > 0 && (
          <Select
            value={selectedCountryCode}
            onValueChange={(value) => setSelectedCountryCode(value)}
            data-testid="selectemployeecatalog-select"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>

            <SelectContent className="z-[210]">
              {catalogCountries.map((country) => (
                <SelectItem value={country.code} key={country.id}>
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={country.code}
                      svg
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span>{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          onValueChange={(value) => setEmploymentType(value)}
          data-testid="selectemployeecatalog-select-2"
        >
          <SelectTrigger>
            <SelectValue placeholder="All employees" />
          </SelectTrigger>

          <SelectContent className="z-[210]">
            {[
              "Contract",
              "Part_Time",
              "Full_Time",
              "Others",
              "All employees",
            ].map((value) => (
              <SelectItem value={value} key={value}>
                {removeUserscore(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToggleGroup
          type="multiple"
          defaultValue={selectedValue}
          value={selectedValue}
          className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3"
          onValueChange={(value: string[]) => handleSelection(value)}
        >
          {newFilteredEmployees?.map((item, index) => {
            const {
              first_name,
              last_name,
              level,
              job_title,
              employment_type,
              email,
            } = item;
            return (
              <ToggleGroupItem
                key={index}
                variant="outline"
                value={email}
                className="w-full h-auto px-0 py-0 border-0"
              >
                <div className="flex flex-col w-full">
                  <Card
                    className={cn(
                      "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                      `${selectedValue?.some((item: string) => item === email) && "border-primary-600 bg-primary-50 text-primary-700"}`,
                    )}
                  >
                    <CardContent className="p-4 flex flex-row items-start justify-between">
                      <div className="flex flex-row items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-gray-600 bg-gray-100">{`${first_name?.[0]} ${last_name?.[0]}`}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex flex-col items-start">
                          <p className="text-sm font-normal leading-none">
                            <span
                              className={cn(
                                "text-gray-700 font-medium",
                                `${selectedValue?.some((item: string) => item === email) && "text-primary-800"}`,
                              )}
                            >{`${first_name} ${last_name}`}</span>{" "}
                            {removeUserscore(level || "")}
                          </p>
                          <p className="text-sm font-normal">
                            {job_title || ""},{" "}
                            <span>
                              {removeUserscore(employment_type || "")}
                            </span>
                          </p>
                        </div>
                      </div>

                      {!selectedValue?.some(
                        (item: string) => item === email,
                      ) ? (
                        <Image
                          src={checkbox_gray_300}
                          alt="check_primary_icon"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <Image
                          src={checkbox_primary_600}
                          alt="check_primary_icon"
                          width={24}
                          height={24}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <DrawerFooter
        onClose={onClose}
        onSubmit={onSubmit}
        disableSubmitButton={
          selectedValue.length === 0 || shareCatalogProps.isLoading
        }
      />
    </PageState>
  );
};

export default SelectEmployeeCatalog;
