import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import Autocomplete, { SingleSelectValue } from "@/components/ui/autocomplete";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { IEmployees } from "@/types/employees";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { Earth } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";
import ReactCountryFlag from "react-country-flag";

interface Props {
  employeeData: IEmployees[];
  isLoading?: boolean;
  isError?: boolean;
  searchValue: string | null;
  setSearch: (value: string) => void;
  selectedCountyValue: SingleSelectValue | null;
  setSelectedCountyValue: (value: SingleSelectValue | null) => void;
  selectedValue: string | undefined;
  setSelectedValue: (value: string | undefined) => void;
  countryKey: string;
  assigneeId?: string;
}
const SingleInstance: FC<Props> = ({
  employeeData,
  isLoading,
  isError,
  selectedCountyValue,
  setSelectedCountyValue,
  searchValue,
  setSearch,
  selectedValue,
  setSelectedValue,
  countryKey,
  assigneeId,
}) => {
  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;
  const transformCountries = countries?.map((item: any) => ({
    value: item?.name,
    label: item?.name,
    icon: (
      <ReactCountryFlag
        countryCode={item?.code || "NG"}
        svg
        style={{
          width: "20px",
          height: "20px",
        }}
      />
    ),
  }));

  const handleSelection = (value: string | undefined) => {
    setSelectedValue(value);
  };

  return (
    <PageState isLoading={isLoading as boolean} isError={isError as boolean}>
      <div className="space-y-5 mt-8 px-0">
        <Autocomplete
          externalKey={countryKey}
          options={transformCountries}
          setSelectedOption={(value) => {
            setSelectedCountyValue(value as any);
          }}
          selectedOption={selectedCountyValue}
          isSearchable
          placeholder="Select country"
          placeholderIcon={<Earth />}
          isClearable={true}
          portalInBody={false}
          data-testid="singleinstance-autocomplete"
        />
        <SearchWithIcon
          placeholder="Search employee"
          value={searchValue}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ToggleGroup
          type="single"
          defaultValue={selectedValue}
          value={selectedValue}
          className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3"
          onValueChange={(value: string | undefined) => handleSelection(value)}
        >
          {employeeData
            ?.filter((filterItem) => filterItem?.id !== assigneeId)
            ?.map((item) => {
              const {
                first_name,
                last_name,
                level,
                job_title,
                employment_type,
                id,
              } = item;
              return (
                <ToggleGroupItem
                  key={id}
                  variant="outline"
                  value={id}
                  className="w-full h-auto px-0 py-0 border-0"
                >
                  <div className="flex flex-col w-full">
                    <Card
                      className={cn(
                        "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                        `${selectedValue === id && "border-primary-600 bg-primary-50 text-primary-700"}`,
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
                                  `${selectedValue === id && "text-primary-800"}`,
                                )}
                              >{`${first_name} ${last_name}`}</span>{" "}
                              {removeUserscore(level || "")}
                            </p>
                            <p className="text-sm font-normal">
                              {job_title && `${job_title || ""},`}{" "}
                              <span>
                                {removeUserscore(employment_type || "")}
                              </span>
                            </p>
                          </div>
                        </div>

                        {selectedValue === id ? (
                          <Image
                            src={checkbox_primary_600}
                            alt="check_primary_icon"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <Image
                            src={checkbox_gray_300}
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
    </PageState>
  );
};

export default SingleInstance;
