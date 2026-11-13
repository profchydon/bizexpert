import React, { FC, useEffect, useState } from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { addEmployeeSchema } from "./validation";
import { PhoneInput } from "@/components/ui/phone-input";
import { useAppDispatch, useAppSelector } from "@/store";
import { Input } from "@/components/ui/input";
import { removeUserscore } from "@/utils/underScoreTransformer";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { Button } from "@/components/ui/button";
import {
  AddEmployeeRequest,
  EditEmployeeRequest,
  IEmployees,
} from "@/types/employees";
import { useAddEmployeesMutation } from "@/api/baseQueries/companiesApi/employeesApi/addEmployees";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import FormField from "@/components/Custom/FormField";
import { useGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import { useEditEmployeeMutation } from "@/api/baseQueries/companiesApi/employeesApi/editEmployee";
import useDepartment from "@/hooks/useDepartment";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import DepartmentField from "@/components/DepartmentField";
import JobTitleField from "@/components/JobTitleField";
import LineManagerField from "@/components/LineManagerField";
import LevelField from "@/components/LevelField";
import useLevel from "@/hooks/useLevel";
import { buildEmployeeUpdatePayload } from "./employeeUpdatePayload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  next: () => void;
  edit_instance?: boolean;
  equipment_instance?: boolean;
  equipment_id?: string;
  employeepage_instance?: boolean;
  employeeViewpage_instance?: boolean;
  onEmployeeAdded?: (employee: IEmployees) => void;
  initialCountry?: string;
  suppressRouteSync?: boolean;
  lockCountryToInitial?: boolean;
}

const AddEmployee: FC<Props> = ({
  isOpen,
  onClose,
  next,
  edit_instance = false,
  equipment_instance = false,
  equipment_id,
  employeepage_instance = false,
  employeeViewpage_instance = false,
  onEmployeeAdded,
  initialCountry,
  suppressRouteSync = false,
  lockCountryToInitial = false,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const param = useSearchParams();
  const employeeId = param.get("id") as string;
  const getEquipValues = param.get("equipValues");
  const getEquipArrayData = param.get("equipment_data");
  const duplicateManagerName = param.get("manager_name") ?? undefined;
  const duplicateLevelName = param.get("level_name") ?? undefined;
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const [isVisible, setIsVisible] = useState(false);
  const companyId = useWorkspaceCompanyId();

  const { getDepartments } = useDepartment();
  const { getLevels } = useLevel();

  const { data: getSingleEmployee } = useGetSingleEmployeeQuery(
    { companyId: companyId!, employeeId },
    { skip: !companyId || !employeeId },
  );

  const formateDepartmentValueLabel = useTransformToValueLabel(
    // @ts-ignore
    getDepartments?.data?.data,
  );
  const formatLevelValueLabel = useTransformToValueLabel(
    // @ts-ignore
    getLevels?.data?.data,
  );
  const duplicateLevelOption = formatLevelValueLabel?.find(
    (item) => item.label === duplicateLevelName,
  );

  const { data: getCountries } = useGetCountriesQuery();
  const formateCountriesValueLabel = useTransformToValueLabel(
    getCountries?.data?.data,
  );

  const [addEmployees] = useAddEmployeesMutation();
  const [editEmployee] = useEditEmployeeMutation();

  const form = useForm<z.infer<typeof addEmployeeSchema>>({
    resolver: zodResolver(addEmployeeSchema),

    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      personal_email: "",
      phone: "",
      job_title: "",
      manager_id: "",
      employment_type: "",
      level: "",
      department_id: "",
      country_id: "",
      address: "",
      landmark: "",
      tax_number: "",
    },
  });

  const { control, reset } = form;

  const watchedFields = useWatch({ control });

  useEffect(() => {
    const filteredFields = Object.entries(watchedFields)
      .filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null,
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const queryString = qs.stringify(filteredFields);

    const shouldSyncRoute =
      suppressRouteSync !== true &&
      edit_instance !== true &&
      equipment_instance !== true;

    if (shouldSyncRoute) {
      if (employeepage_instance) {
        router.replace(`/dashboard/employees?${queryString}`, undefined);
        return;
      }

      router.replace(
        `/dashboard/equip-employee/employees?${queryString}`,
        undefined,
      );
    }
  }, [
    watchedFields,
    router,
    suppressRouteSync,
    edit_instance,
    equipment_instance,
    employeepage_instance,
  ]);

  const getRedirectPath = () => {
    if (employeepage_instance) {
      if (employeeViewpage_instance) {
        return "/dashboard/employees";
      }

      return `/dashboard/employees/${employeeId}`;
    }

    return "/dashboard/equip-employee/employees";
  };

  const handleEquipmentRedirect = (newEmployeeId: string) => {
    if (getEquipValues) {
      const queryObject = {
        ...JSON.parse(getEquipValues),
        assignee: newEmployeeId,
      };
      const queryDataString = qs.stringify({
        equipValues: JSON.stringify(queryObject),
      });
      router.replace(`/dashboard/all-equipments?${queryDataString}`);
      return;
    }

    if (!getEquipArrayData) {
      return;
    }

    const equipmentArray = JSON.parse(getEquipArrayData);
    const findEquipmentInstance = equipmentArray.find(
      (item: any) => item.id === equipment_id,
    );

    if (!findEquipmentInstance) {
      return;
    }

    findEquipmentInstance.assignee = newEmployeeId;

    const updatedEquipmentArray = equipmentArray.filter(
      (equipment: any) => Number(equipment.id) !== Number(equipment_id),
    );

    updatedEquipmentArray.push(findEquipmentInstance);

    const queryDataString = qs.stringify({
      equipment_data: JSON.stringify(updatedEquipmentArray),
    });
    router.replace(
      `/dashboard/all-equipments?${queryDataString}&equipment_id=${equipment_id}&edit=true`,
    );
  };

  const handleAddedEmployeeSuccess = (newEmployee: IEmployees) => {
    if (equipment_instance !== true && employeepage_instance !== true) {
      if (!employees || employees.length < 1) {
        dispatch(setSelectedEmployees([newEmployee]));
      } else {
        dispatch(setSelectedEmployees([...employees, newEmployee]));
      }
    }

    displaySuccessMessage(
      "Employee added successfully",
      "New employee has been added to the company roster.",
    );

    if (onEmployeeAdded) {
      onEmployeeAdded(newEmployee);
      reset();
      onClose();
      next();
      return;
    }

    if (equipment_instance === true) {
      handleEquipmentRedirect(newEmployee.id);
    } else {
      router.replace(getRedirectPath());
    }

    reset();
    onClose();
    next();
  };

  const onSubmit = async (data: z.infer<typeof addEmployeeSchema>) => {
    if (!employeeId && !edit_instance) {
      const payload = {
        companyId: companyId!,
        payload: data,
      } as AddEmployeeRequest;

      try {
        const res = await addEmployees(payload).unwrap();
        const newEmployee = res?.data;
        handleAddedEmployeeSuccess(newEmployee);
      } catch {
        return;
      }

      return;
    }

    if (employeeId && edit_instance) {
      const updatePayload = buildEmployeeUpdatePayload(data, {
        countryOptions: formateCountriesValueLabel,
        currentEmployee: getSingleEmployee?.data,
        departmentOptions: formateDepartmentValueLabel,
        levelOptions: formatLevelValueLabel,
      });
      const payload = {
        companyId: companyId!,
        employeeId,
        payload: updatePayload,
      } as EditEmployeeRequest;

      return await editEmployee(payload)
        .unwrap()
        .then((res) => {
          const responseData = res?.data;
          const updatedEmployees = employees?.map((employee) => {
            return employee.id === employeeId
              ? { ...employee, ...responseData }
              : employee;
          });

          dispatch(setSelectedEmployees(updatedEmployees));
          displaySuccessMessage(
            "Employee updated successfully",
            "Employee's details has been updated in the company's roster.",
          );

          router.replace(getRedirectPath());
          reset();
          onClose();
          next();
        })
        .catch(showApiError);
    }
  };

  useEffect(() => {
    if (!employeeId && !edit_instance) {
      const queryObject = qs.parse(globalThis.location.search, {
        ignoreQueryPrefix: true,
      });
      const formValues = form.getValues();
      Object.keys(queryObject).forEach((key: any) => {
        if (key in formValues) {
          form.setValue(key, queryObject[key]);
        }
      });
    }
  }, [edit_instance, employeeId, form]);

  useEffect(() => {
    if (!edit_instance && duplicateLevelOption?.value) {
      form.setValue("level", duplicateLevelOption.value);
    }
  }, [duplicateLevelOption?.value, edit_instance, form]);

  const { country } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const returnCoutryName = (country_id: string) => {
    return getCountries?.data?.data?.find(
      (item: any) => item.id === country_id,
    );
  };

  const countryName = returnCoutryName(String(country?.id));
  const initialCountryOption = formateCountriesValueLabel?.find(
    (item: any) => item?.label === initialCountry,
  );
  const shouldLockCountry =
    edit_instance !== true &&
    lockCountryToInitial === true &&
    Boolean(initialCountry);
  const canEditAddress = edit_instance
    ? getSingleEmployee?.data?.can_edit_address !== false
    : true;
  const shouldDisableCountryField = shouldLockCountry || !canEditAddress;
  const shouldDisableAddressField = !canEditAddress;
  const addressLockTooltipMessage =
    "Address and country cannot be changed while this employee has an order in progress.";

  useEffect(() => {
    if (!edit_instance && initialCountryOption?.label) {
      form.setValue("country_id", initialCountryOption.label);
    } else if (!edit_instance && !employeepage_instance && country) {
      form.setValue("country_id", countryName?.name);
    }

    if (employeeId && edit_instance && getSingleEmployee?.data) {
      Object.keys(getSingleEmployee?.data).forEach((key: any) => {
        // @ts-ignore
        form.setValue(key, getSingleEmployee?.data[key]);

        if (key === "departments") {
          // @ts-ignore
          const deptvalue = getSingleEmployee?.data?.["departments"];
          form.setValue("department_id", deptvalue?.[0]?.id);
        }
        if (key === "country") {
          const findCountry = formateCountriesValueLabel?.find(
            // @ts-ignore
            (country) => country.label === getSingleEmployee?.data["country"],
          );

          // @ts-ignore
          form.setValue("country_id", findCountry?.label);
        }
        if (key === "line_manager") {
          form.setValue(
            "manager_id",
            getSingleEmployee?.data?.line_manager?.id ?? "",
          );
        }
        if (key === "manager") {
          form.setValue(
            "manager_id",
            getSingleEmployee?.data?.manager?.id ?? "",
          );
        }
      });
    }
  }, [
    country,
    countryName?.id,
    edit_instance,
    employeepage_instance,
    form.setValue,
    formateCountriesValueLabel,
    getSingleEmployee?.data,
    initialCountryOption?.value,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen && edit_instance) return null; //Don't remove this

  return (
    <div className={`pt-5 w-full lg:w-[824px]`}>
      {isVisible ? (
        <Form {...form}>
          <form
            className="flex flex-col h-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="p-6 grid gap-4 grid-cols-2 h-[calc(100%-154px) pb-[70px] overflow-y-auto">
              <FormField
                control={form.control}
                name="first_name"
                label="First name"
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    placeholder="Enter first name"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-testid="addemployee-input"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                label="Last name"
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    placeholder="Enter last name"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-testid="addemployee-input-2"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="personal_email"
                label="Personal email (Optional)"
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    type="email"
                    placeholder="Enter employee's personal email"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-testid="addemployee-input-3"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="email"
                label="Work email"
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    type="email"
                    placeholder="Enter employee's work email"
                    {...restField}
                    onChange={(e) => {
                      if (!edit_instance) {
                        onChange(e.target.value);
                      }
                    }}
                    readOnly={edit_instance}
                    data-testid="addemployee-input-4" // Make the field read-only if editing an existing employee
                  />
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                label="Phone number"
                render={({ field: { onChange, ...restField } }) => (
                  <PhoneInput
                    defaultCountry="NG"
                    {...restField}
                    onChange={(value) => {
                      onChange(value);
                    }}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="tax_number"
                label="National ID/Tax Number (Optional)"
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    placeholder="Enter National ID/Tax Number"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-ph-mask
                    data-testid="addemployee-input-5"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="level"
                label="Level"
                render={({ field: { onChange, value, ...restField } }) => (
                  <LevelField
                    onChange={(value) => onChange(value)}
                    defaultValue={value}
                    isName={edit_instance ?? true}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="department_id"
                label="Department"
                render={({ field: { onChange, value, ...restField } }) => {
                  const defaultInstance = formateDepartmentValueLabel?.find(
                    (item) => item.value === value,
                  );
                  return (
                    <DepartmentField
                      onChange={(value) => onChange(value)}
                      defaultValue={defaultInstance && (defaultInstance as any)}
                    />
                  );
                }}
              />

              <FormField
                control={form.control}
                name="job_title"
                label="Job Title"
                render={({ field: { onChange, value } }) => (
                  <JobTitleField
                    value={value}
                    onChange={onChange}
                    placeholder="Select job title"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="manager_id"
                label="Line Manager"
                render={({ field: { onChange, value } }) => (
                  <LineManagerField
                    value={value}
                    selectedLabel={
                      edit_instance
                        ? employeeLineManagerLabel(
                            getSingleEmployee?.data?.line_manager ??
                              getSingleEmployee?.data?.manager,
                          )
                        : duplicateManagerName
                    }
                    excludeEmployeeId={employeeId}
                    onChange={onChange}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="employment_type"
                label="Employment type"
                render={({ field: { onChange, value, ...restField } }) => (
                  <Select
                    {...restField}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                    defaultValue={value}
                    data-testid="addemployee-select"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>

                    <SelectContent>
                      {["Contract", "Part_Time", "Full_Time", "Others"].map(
                        (value) => (
                          <SelectItem value={value} key={value}>
                            {removeUserscore(value)}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />

              <FormField
                control={form.control}
                name="country_id"
                label="Select country"
                render={({ field: { onChange, value, ...restField } }) => {
                  const countrySelectField = (
                    <Select
                      {...restField}
                      disabled={shouldDisableCountryField}
                      onValueChange={(value) => {
                        onChange(value);
                        form.setValue("address", "");
                      }}
                      defaultValue={value}
                      data-testid="addemployee-select-2"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>

                      <SelectContent>
                        {formateCountriesValueLabel?.map(({ value, label }) => (
                          <SelectItem value={label} key={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );

                  if (edit_instance && !canEditAddress) {
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>{countrySelectField}</div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-[280px] whitespace-normal text-center leading-5"
                          >
                            {addressLockTooltipMessage}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }

                  return countrySelectField;
                }}
              />

              <FormField
                className="col-span-2"
                control={form.control}
                name="address"
                label="Address"
                render={({ field: { onChange, ...restField } }) =>
                  (() => {
                    const addressInputField = (
                      <Input
                        type="address"
                        placeholder="Enter Address"
                        {...restField}
                        disabled={shouldDisableAddressField}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        data-ph-mask
                        data-testid="addemployee-input-6"
                      />
                    );

                    if (edit_instance && !canEditAddress) {
                      return (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>{addressInputField}</div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[280px] whitespace-normal text-center leading-5"
                            >
                              {addressLockTooltipMessage}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    }

                    return addressInputField;
                  })()
                }
              />

              <FormField
                className="col-span-2"
                control={form.control}
                name="landmark"
                label="Nearest landmark"
                render={({ field: { onChange, ...restField } }) => (
                  <Textarea
                    placeholder="Enter nearest landmark (e.g., famous building, park)"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                  />
                )}
              />
            </div>

            <div className="fixed bottom-0 w-full py-4 px-6 border-t bg-white border-gray-200">
              <div className="flex justify-end">
                <div className="grid place-content-end my-auto h-full">
                  <div className="flex gap-x-4">
                    <Button
                      type="button"
                      className="text-sm font-semibold"
                      variant="outline"
                      onClick={onClose}
                      data-testid="addemployee-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={form?.formState?.isSubmitting}
                      className="text-sm font-semibold"
                      data-testid="addemployee-button-2"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <div className="text-center">loading</div>
      )}
    </div>
  );
};

export default AddEmployee;

function employeeLineManagerLabel(manager?: Partial<IEmployees> | null) {
  if (!manager) return undefined;
  return (
    [manager.first_name, manager.last_name].filter(Boolean).join(" ") ||
    manager.email
  );
}
