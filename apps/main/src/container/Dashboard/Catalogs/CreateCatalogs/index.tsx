import React, { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import DrawerRight from "@/components/DrawerRight";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  createCatalogSchema,
  createDeviceCatalogSchema,
  createBudgetCatalogSchema,
} from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Autocomplete, {
  MultiSelectValue,
  SingleSelectValue,
} from "@/components/ui/autocomplete";
import FormField from "@/components/Custom/FormField";
import { Textarea } from "@/components/ui/textarea";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import CountrySelectField from "@/components/CountrySelectField";
import { useGetDepartmentsQuery } from "@/api/baseQueries/companiesApi/departmentsApi/getDepartments";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useCreateCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/createCatalog";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { ICatalog } from "@/types/catalog";
import { useEditCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/editCatalog";
import useLevel from "@/hooks/useLevel";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import useTransformCountriesWithETA from "@/hooks/useTransformCountriesWithETA";
import { Globe, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editCatalogData?: ICatalog;
  duplicateCatalogData?: ICatalog;
  catalogType?: "device" | "budget";
}

const getCatalogTitle = (
  editCatalogData?: ICatalog,
  duplicateCatalogData?: ICatalog,
  catalogType?: "device" | "budget",
) => {
  if (editCatalogData) {
    return editCatalogData.type === "budget"
      ? "Edit Budget Catalog"
      : "Edit Device Catalog";
  }

  if (duplicateCatalogData) {
    return duplicateCatalogData.type === "budget"
      ? "Duplicate Budget Catalog"
      : "Duplicate Device Catalog";
  }

  return catalogType === "budget"
    ? "Create Budget Catalog"
    : "Create Device Catalog";
};

const getCatalogDescription = (
  hasEditCatalogData: boolean,
  hasDuplicateCatalogData: boolean,
  catalogType?: "device" | "budget",
) => {
  if (hasEditCatalogData) {
    return "Please edit the details for your catalog";
  }

  if (hasDuplicateCatalogData) {
    return "Please add the details for your duplicate catalog";
  }

  return catalogType === "budget"
    ? "Set spending limits per employee role or department."
    : "Build a curated selection of laptops, monitors, or accessories that employees can choose from.";
};

const CreateCatalog: React.FC<Props> = ({
  isOpen,
  onClose,
  editCatalogData,
  duplicateCatalogData,
  catalogType,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<SingleSelectValue>();
  const [selectedCountries, setSelectedCountries] = useState<MultiSelectValue>(
    [],
  );
  const [selectedDepartments, setSelectedDepartments] =
    useState<MultiSelectValue>();
  const [selectedLevels, setSelectedLevels] = useState<MultiSelectValue>([]);

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data: departmentRes } = useGetDepartmentsQuery({
    companyId: companyId!,
    params: { paginate: false },
  });
  const departments = departmentRes?.data.data ?? [];
  const departmentOptions = departments.map((department) => ({
    value: department.id,
    label: department.name,
  }));

  const { getLevels } = useLevel();
  const levelOptions = useTransformToValueLabel(
    // @ts-ignore
    getLevels?.data?.data,
  );

  // Get countries for multi-select (budget catalog)
  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;
  const countryOptions = useTransformCountriesWithETA(countries);

  // Determine if budget catalog based on catalogType prop OR the catalog being edited/duplicated
  const isBudgetCatalog =
    catalogType === "budget" ||
    editCatalogData?.type === "budget" ||
    duplicateCatalogData?.type === "budget";

  const [createCatalog, createCatalogProps] = useCreateCatalogMutation();
  const [editCatalog, editCatalogProps] = useEditCatalogMutation();

  const validationSchema = isBudgetCatalog
    ? createBudgetCatalogSchema
    : createDeviceCatalogSchema;

  const form = useForm<z.infer<typeof createCatalogSchema>>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      country_ids: "",
      departments: "",
      description: "",
      levels: "",
      name: "",
    },
  });

  const selectAllCountries = () => {
    setSelectedCountries(countryOptions as MultiSelectValue);
    form.setValue(
      "country_ids",
      JSON.stringify(countryOptions.map((country) => country.value)),
      { shouldValidate: true },
    );
  };

  const clearAllCountries = () => {
    setSelectedCountries([]);
    form.setValue("country_ids", "", { shouldValidate: true });
  };

  const areAllCountriesSelected = useMemo(() => {
    if (!countryOptions.length || !selectedCountries?.length) return false;
    return selectedCountries.length === countryOptions.length;
  }, [selectedCountries, countryOptions]);

  const onSubmit = async (data: z.infer<typeof createCatalogSchema>) => {
    const departments = selectedDepartments?.map((dept) => dept.value) ?? [];
    const levels = selectedLevels?.map((level) => level.value) ?? [];
    const countryIds: string[] = [];

    if (isBudgetCatalog) {
      countryIds.push(
        ...(selectedCountries?.map((country) => country.value) ?? []),
      );
    } else if (selectedCountry?.value) {
      countryIds.push(selectedCountry.value);
    }

    if (!editCatalogData) {
      const payload = {
        companyId: companyId!,
        country_ids: countryIds,
        departments: departments.length > 0 ? departments : undefined,
        levels: levels.length > 0 ? levels : undefined,
        description: data.description,
        name: data.name,
        type: isBudgetCatalog ? "budget" : "device",
      } as any;

      await createCatalog(payload)
        .unwrap()
        .then((res) => {
          displaySuccessMessage("Catalog created successfully");
          onClose();
          setSelectedCountry({} as SingleSelectValue);
          setSelectedCountries([]);
          setSelectedDepartments([]);
          setSelectedLevels([]);
        })
        .catch(showApiError);
    }
    if (editCatalogData) {
      await editCatalog({
        companyId: companyId!,
        country_ids: countryIds,
        departments,
        levels,
        description: data.description,
        name: data.name,
        catalogId: editCatalogData.id,
      } as any)
        .unwrap()
        .then((res) => {
          displaySuccessMessage("Catalog updated successfully");
          onClose();
          form.reset();
          setSelectedCountry({} as SingleSelectValue);
          setSelectedDepartments([]);
          setSelectedLevels([]);
        })
        .catch(showApiError);
    }
  };

  useEffect(() => {
    if (isOpen && !editCatalogData && !duplicateCatalogData) {
      form.reset({
        country_ids: "",
        departments: "",
        description: "",
        levels: "",
        name: "",
      });
      setSelectedCountry({} as SingleSelectValue);
      setSelectedCountries([]);
      setSelectedDepartments([]);
      setSelectedLevels([]);
    }
  }, [isOpen, catalogType]);

  const setFormAndSelectionData = (catalog: ICatalog) => {
    const isBudgetType = catalog.type === "budget";
    const catalogCountries = catalog.countries ?? [];

    const departments = catalog.departments.map((dept) => ({
      label: dept.name,
      value: dept.id,
    }));
    setSelectedDepartments(departments);

    const levels = catalog.levels.map((level) => ({
      label: level.name,
      value: level.id,
    }));
    setSelectedLevels(levels);

    if (isBudgetType && catalogCountries.length > 0) {
      const selectedIds = catalogCountries.map((country) => country.id);
      const countriesData =
        countryOptions.length > 0
          ? countryOptions.filter((option) =>
              selectedIds.includes(option.value),
            )
          : catalogCountries.map((country) => ({
              label: country.name,
              value: country.id,
            }));

      setSelectedCountries(countriesData as MultiSelectValue);
      setSelectedCountry({} as SingleSelectValue);

      form.reset({
        country_ids: JSON.stringify(selectedIds),
        description: catalog.description,
        levels: JSON.stringify(levels),
        name: catalog.name,
        departments: JSON.stringify(departments),
      });
      return;
    }

    const singleCountry = catalog.countries?.[0] ?? null;
    setSelectedCountry(
      singleCountry
        ? { label: singleCountry.name, value: singleCountry.id }
        : ({} as SingleSelectValue),
    );
    setSelectedCountries([]);

    form.reset({
      country_ids: singleCountry?.id ? JSON.stringify([singleCountry.id]) : "",
      description: catalog.description,
      levels: JSON.stringify(levels),
      name: catalog.name,
      departments: JSON.stringify(departments),
    });
  };

  useEffect(() => {
    const catalog = editCatalogData ?? duplicateCatalogData;
    if (catalog) {
      setFormAndSelectionData(catalog);
    }

    if (duplicateCatalogData) {
      form.setValue("country_ids", "");
      setSelectedCountry({} as SingleSelectValue);
      setSelectedCountries([]);
    }
  }, [editCatalogData, duplicateCatalogData, countryOptions]);

  const drawerTitle = getCatalogTitle(
    editCatalogData,
    duplicateCatalogData,
    catalogType,
  );
  const drawerDescription = getCatalogDescription(
    Boolean(editCatalogData),
    Boolean(duplicateCatalogData),
    catalogType,
  );
  let saveText = "Save";
  if (editCatalogData) {
    saveText = "Update";
  } else if (duplicateCatalogData) {
    saveText = "Duplicate";
  }

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        drawerTitle={drawerTitle}
        drawerDescription={drawerDescription}
        hideDefaultFooterBtn
        data-testid="createcatalogs-drawerright"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mb-7"
          >
            <FormField
              control={form.control}
              name="name"
              label="Catalog name*"
              render={({ field }) => (
                <Input
                  placeholder="Developer Starter Kit"
                  {...field}
                  data-testid="createcatalogs-input"
                />
              )}
            />

            <FormField
              control={form.control}
              name="levels"
              label="Levels"
              render={({ field }) => (
                <Autocomplete
                  options={levelOptions ?? []}
                  setSelectedOption={(value) => {
                    setSelectedLevels(value as MultiSelectValue);
                    field.onChange(JSON.stringify(value));
                  }}
                  selectedOption={selectedLevels}
                  isSearchable
                  isMulti
                  placeholder="Select levels"
                  data-testid="createcatalogs-autocomplete"
                />
              )}
            />

            <FormField
              control={form.control}
              name="departments"
              label="Departments"
              render={({ field }) => (
                <Autocomplete
                  options={departmentOptions}
                  setSelectedOption={(value) => {
                    setSelectedDepartments(value as MultiSelectValue);
                    field.onChange(JSON.stringify(value));
                  }}
                  selectedOption={selectedDepartments!}
                  isSearchable
                  isMulti
                  placeholder="Select Departments"
                  data-testid="createcatalogs-autocomplete-2"
                />
              )}
            />

            {isBudgetCatalog ? (
              <FormField
                control={form.control}
                name="country_ids"
                label="Country*"
                render={({ field: { onChange, value, ...restField } }) => (
                  <div className="flex flex-col gap-y-3">
                    <div className="flex items-center gap-x-2">
                      <Checkbox
                        id="select-all-countries"
                        checked={areAllCountriesSelected}
                        onCheckedChange={(checked) =>
                          checked ? selectAllCountries() : clearAllCountries()
                        }
                        className="h-5 w-5"
                        data-testid="createcatalogs-checkbox"
                      />
                      <label
                        htmlFor="select-all-countries"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Select all countries
                      </label>
                    </div>
                    {areAllCountriesSelected ? (
                      <div className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary-600" />
                          <span className="text-sm font-medium text-gray-700">
                            All countries selected
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                            {countryOptions.length}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={clearAllCountries}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Clear all countries"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <CountrySelectField
                        onChange={(value) => {
                          const multiValue =
                            value as unknown as MultiSelectValue;
                          setSelectedCountries(multiValue);
                          const jsonValue = JSON.stringify(
                            multiValue?.map((c) => c.value) ?? [],
                          );
                          form.setValue("country_ids", jsonValue, {
                            shouldValidate: true,
                          });
                        }}
                        selectedOption={selectedCountries}
                        isMulti
                        placeholder="Select countries"
                      />
                    )}
                  </div>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="country_ids"
                label="Country*"
                render={({ field: { onChange, value, ...restField } }) => (
                  <CountrySelectField
                    onChange={(value) => {
                      setSelectedCountry(value);
                      // Store as JSON array with single country for device catalog
                      form.setValue(
                        "country_ids",
                        value?.value ? JSON.stringify([value.value]) : "",
                        { shouldValidate: true },
                      );
                    }}
                    selectedOption={selectedCountry! as any}
                  />
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              label="Description*"
              render={({ field }) => (
                <Textarea
                  placeholder="All the necessary hardware for new developers joining the team."
                  className="resize-none"
                  {...field}
                />
              )}
            />
            <DrawerFooter
              saveText={saveText}
              onClose={onClose}
              disableSubmitButton={
                !form.formState.isValid ||
                createCatalogProps.isLoading ||
                editCatalogProps.isLoading
              }
              submitButtonType="submit"
            />
          </form>
        </Form>
      </DrawerRight>
    </div>
  );
};

export default CreateCatalog;
