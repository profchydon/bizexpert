import React, { useState, useEffect } from "react";

import DrawerRight from "@/components/DrawerRight";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useFilterByEmploymentType from "@/hooks/useFilterByEmploymentType";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { IEmployees } from "@/types/employees";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import PageState from "@/components/PageState";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import SearchWithIcon from "@/components/SearchWithIcon";
import { useDebounce } from "use-debounce";
import EmployeeEmptyTableIntance from "./EmployeeTable/EmployeeEmptyTableIntance";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SelectEmployee: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const companyId = useWorkspaceCompanyId();
  const { country: equipEmployeeCountry } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const [search, setSearch] = useState<string>("");
  const [searchValue] = useDebounce(search, 300);
  const [selectedCountyValue, setSelectedCountyValue] =
    useState<SingleSelectValue | null>(null);

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const {
    data: getEmployees,
    isLoading,
    isError,
    refetch,
  } = useGetEmployeesQuery(
    {
      companyId: companyId!,
      params: {
        search: searchValue
          ? searchValue
          : selectedCountyValue?.value
            ? selectedCountyValue?.value
            : null,
        paginate: false,
      },
    },
    { skip: !companyId },
  );

  useEffect(() => {
    if (equipEmployeeCountry?.code && companyId) {
      refetch();
    }
  }, [equipEmployeeCountry?.code, companyId, refetch]);

  // @ts-ignore
  const employeeData = getEmployees?.data?.data;
  const [employmentType, setEmploymentType] = useState<string>("");

  const filteredEmployees = useFilterByEmploymentType(
    employeeData,
    employmentType,
  ) as IEmployees[];
  const newFilteredEmployees = filteredEmployees?.filter(
    (employee) =>
      employee.country_code?.toLowerCase() ===
      equipEmployeeCountry?.code?.toLowerCase(),
  );
  const availableEmployees = newFilteredEmployees?.filter(
    (filterdItem) =>
      !employees?.some((employee) => employee.id === filterdItem.id),
  );
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const handleSelection = (value: string[]) => {
    setSelectedValue(value);
  };

  const handleSubmit = () => {
    const payload =
      employeeData?.filter((item: IEmployees) =>
        selectedValue.includes(item?.id),
      ) ?? [];

    // @ts-ignore
    if (employees) {
      const existingEmployeeIds = employees?.map((employee) => employee.id);

      const newEmployees = payload.filter(
        (newEmployee: any) => !existingEmployeeIds?.includes(newEmployee.id),
      );

      if (newEmployees.length > 0) {
        dispatch(setSelectedEmployees([...employees, ...newEmployees]));
      } else {
      }
    } else {
      dispatch(setSelectedEmployees(payload));
    }

    onClose();
  };

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        onSave={handleSubmit}
        isSaveButtonDisabled={selectedValue?.length < 1}
        drawerTitle="Select employees"
        drawerDescription="Please select employees you want to onboard"
        data-testid="selectemployee-drawerright"
      >
        <PageState isLoading={isLoading} isError={isError}>
          <div className="space-y-5 px-0">
            <SearchWithIcon
              placeholder="Search employee"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {availableEmployees?.length === 0 ? (
              <EmployeeEmptyTableIntance showButtons={false} />
            ) : (
              <ToggleGroup
                type="multiple"
                defaultValue={selectedValue}
                value={selectedValue}
                className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3"
                onValueChange={(value: string[]) => handleSelection(value)}
              >
                {availableEmployees?.map((item, index) => {
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
                      key={index}
                      variant="outline"
                      value={id}
                      className="w-full h-auto px-0 py-0 border-0"
                    >
                      <div className="flex flex-col w-full">
                        <Card
                          className={cn(
                            "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                            `${selectedValue?.some((item: string) => item === id) && "border-primary-600 bg-primary-50 text-primary-700"}`,
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
                                      `${selectedValue?.some((item: string) => item === id) && "text-primary-800"}`,
                                    )}
                                  >{`${first_name} ${last_name}`}</span>{" "}
                                  {/* {removeUserscore(level || "")} */}
                                </p>
                                <p className="text-sm font-normal">
                                  {job_title && `${job_title || ""},`}{" "}
                                  <span>
                                    {removeUserscore(employment_type || "")}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {!selectedValue?.some(
                              (item: string) => item === id,
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
            )}
          </div>
        </PageState>
      </DrawerRight>
    </div>
  );
};

export default SelectEmployee;
