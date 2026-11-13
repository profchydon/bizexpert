import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useEffect, useState } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import { addSingleEquipmentSchema } from "./validation";
import { z } from "zod";
import qs from "qs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Form } from "@/components/ui/form";
import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useAppSelector } from "@/store";
import useTransformEmployeeToValueLabel from "@/hooks/useTransformEmployeeToValueLabel";
import { OnChangeValue } from "react-select";
import CreatableSelectField from "@/components/CreatableSelectField";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormFileAttachment from "@/components/FormFileAttachment";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import AddEmployee from "@/container/Dashboard/EquipEmployee/Employee/AddEmployees/AddEmployee";
import { updateVisibilityAfterDelay } from "@/utils/updateVisibilityAfterDelay";
import PriceInputField from "@/components/PriceInputField";
import { useGetCurrenciesQuery } from "@/api/baseQueries/currenciesApi/getCurrencies";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { useCreateEquipmentMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/createEquipment";
import {
  CreateEquipmentRequest,
  EditEquipmentRequest,
  IEquipment,
  UpdateEquipmentAssigneeRequest,
} from "@/types/equipments";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { useGetSingleEquipmentQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getSingleEquipment";
import { useEditEquipmentMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/editEquipment";
import { useUnAndReAssignEquipmentAssigneeMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/unAndReAssignEquipmentAssignee";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { formatScientificNotation } from "@/utils/formatScientificNotation";
import CountrySelectField from "@/components/CountrySelectField";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import MultipleSpecFieldGenerator from "@/components/MultipleSpecFieldGenerator";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import EquipmentAssetTypeOptions from "../EquipmentAssetTypeOptions";
import { resolveAssetTypeSelectValue } from "../assetTypeSelect";
import { useUnassignEquipmentAssigneeMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/unassignEquipmentAssignee";

const availableOptions = [
  "battery",
  "color",
  "condition",
  "display",
  "graphics",
  "network",
  "processor",
  "memory",
  "storage",
  "weight",
  "wireless_connectivity",
];

interface Props {
  onClose: () => void;
  edit_instance?: boolean;
  equipmentDetailsInstance?: boolean;
  removeSubmitRoute?: boolean;
}
const SingleEquipment: FC<Props> = ({
  onClose,
  edit_instance = false,
  equipmentDetailsInstance = false,
  removeSubmitRoute = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = useParams();
  const pathEquipmentId = param?.equipmentId as string;
  const [isVisible, setIsVisible] = useState(false);
  const [images, setImages] = useState<File[] | string[]>();
  const getEquipValues = searchParams.get("equipValues");
  const equipmentId = !equipmentDetailsInstance
    ? (searchParams.get("edit_equipment_id") as string)
    : pathEquipmentId;

  const { data: assetTypesRes } = useGetAssetTypesQuery();
  const assetTypes = assetTypesRes?.data;

  const [selectedCountry, setSelectedCountry] = useState<SingleSelectValue>();
  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data: getSingleEmployee } = useGetSingleEquipmentQuery(
    { companyId: companyId!, equipmentId: equipmentId! },
    { skip: !companyId || !equipmentId },
  );

  const equipmentsData = getSingleEmployee?.data;
  const equipmentSource = equipmentsData?.source;

  const { data: getCurrencies } = useGetCurrenciesQuery();

  const {
    data: getEmployees,
    isLoading,
    isError,
  } = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );

  // @ts-ignore
  const employeeData = getEmployees?.data ?? [];

  const currenciesData = getCurrencies?.data;

  const formateEmployeeValueLabel = useTransformEmployeeToValueLabel(
    employeeData as any,
  );

  const form = useForm<z.infer<typeof addSingleEquipmentSchema>>({
    resolver: zodResolver(addSingleEquipmentSchema),

    defaultValues: {
      title: "",
      serial_number: "",
      make: "",
      model: "",
      year: "",
      type: "",
      state: "",
      country: "",
      status: "Unassigned",
      assignee: "",
      details: [],
      properties: [
        { fieldName: "", fieldValue: "" },
        { fieldName: "", fieldValue: "" },
      ],
      purchase_date: "",
      purchase_price: "",
      source: "",
      image: "",
      description: "",
      currency_id: "",
    },
  });

  const { control, reset, formState, setValue, getValues } = form;

  const watchedFields = useWatch({ control });
  const assetAssignStatus = form.getValues().status;
  const assetAssignee = form.getValues().assignee;
  const propsData = form.getValues().properties;

  const [createEquipment] = useCreateEquipmentMutation();
  const [editEquipment] = useEditEquipmentMutation();
  const [unAndReAssignEquipmentAssignee] =
    useUnAndReAssignEquipmentAssigneeMutation();
  const [unassignEquipmentAssignee] = useUnassignEquipmentAssigneeMutation();

  useEffect(() => {
    if (equipmentsData) {
      Object.keys(equipmentsData).forEach((key: any) => {
        // @ts-ignore
        form.setValue(key, equipmentsData[key]);
        // @ts-ignore
        if (key === "image_url" && equipmentsData[key]) {
          // @ts-ignore
          setImages([equipmentsData[key]]);
        }

        if (key === "currency") {
          form.setValue("currency_id", equipmentsData?.currency?.id);
        }
        if (key === "status") {
          form.setValue("status", equipmentsData?.status);
        }
        // if (
        //   key === "other_details" &&
        //   equipmentsData?.other_details !== "undefined"
        // ) {
        //   form.setValue("details", equipmentsData?.other_details?.split(","));
        // }
        if (key === "assignee") {
          // @ts-ignore
          form.setValue("assignee", equipmentsData?.assignee?.id);
        }
        if (key === "purchase_price") {
          // @ts-ignore
          form.setValue(
            "purchase_price",
            formatScientificNotation(equipmentsData?.purchase_price),
          );
        }
        if (key === "specs") {
          const formattedSpecs = Object.entries(equipmentsData?.specs).map(
            ([key, value]) => ({
              fieldName: key,
              fieldValue: value as string,
            }),
          );
          form.setValue("properties", formattedSpecs);
        }
        if (key === "country") {
          // @ts-ignore
          if (countries) {
            const getCountryData = countries.find(
              (country: any) => country.name === equipmentsData?.country,
            );
            setSelectedCountry({
              label: getCountryData?.name,
              value: getCountryData?.id,
            });
            form.setValue("country", getCountryData?.name);
          }
        }
      });
    }
  }, [equipmentsData, form.setValue, countries]);

  useEffect(() => {
    const current = form.getValues("type");
    const resolved = resolveAssetTypeSelectValue(current, assetTypes);
    if (resolved && resolved !== current) {
      form.setValue("type", resolved);
    }
  }, [assetTypes, form]);

  useEffect(() => {
    const queryString = qs.stringify({
      equipValues: JSON.stringify(watchedFields),
    });
    if (!edit_instance) {
      router.replace(`/dashboard/all-equipments?${queryString}`, undefined);
    }
  }, [watchedFields, router]);

  const onSubmit = async (data: z.infer<typeof addSingleEquipmentSchema>) => {
    const imageFile = images?.[0] as Blob | String;

    const transformedObject = data?.properties.reduce(
      (acc, { fieldName, fieldValue }: any) => {
        const formattedKey =
          fieldName === "RAM"
            ? fieldName
            : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        // @ts-ignore
        acc[formattedKey] = fieldValue;
        return acc;
      },
      {},
    );
    const formattedSpecs = Object.entries(transformedObject as any)
      // @ts-ignore
      .map(([key, value]) => `${key.toLowerCase()}:${value.trim()}`)
      .join(", ");

    const updateDefaultValues = (
      defaultValues: z.infer<typeof addSingleEquipmentSchema>,
      image_url: Blob | String,
      details: any[],
    ): IEquipment => {
      defaultValues.details = (details ?? []).join(",");

      if (defaultValues.purchase_date) {
        const formattedDate = format(
          String(defaultValues.purchase_date),
          "yyyy-MM-dd",
        );
        defaultValues.purchase_date = formattedDate;
      }

      if (!defaultValues.assignee && !defaultValues.status) {
        defaultValues.status = "Unassigned";
      }

      if (!image_url || image_url === undefined) {
        delete defaultValues.image;
      } else {
        // @ts-ignore
        defaultValues.image = image_url;
      }

      // @ts-ignore
      return defaultValues;
    };

    const updatedValues = updateDefaultValues(
      data,
      imageFile,
      data?.details as any,
    );

    const formData = new FormData();
    formData.append("title", updatedValues?.title);
    formData.append("make", updatedValues?.make);
    formData.append("model", updatedValues?.model);
    formData.append("type", updatedValues?.type);
    formData.append("source", "External");
    formData.append("state", updatedValues?.state);
    formData.append("status", data?.status as string);
    if (updatedValues?.assignee) {
      formData.append("assignee", updatedValues?.assignee as any);
    }

    // @ts-ignore
    formData.append("currency_id", updatedValues?.currency_id);
    if (updatedValues?.description && updatedValues?.description !== "null") {
      formData.append("description", updatedValues?.description);
    }

    // @ts-ignore
    if (data?.country) {
      formData.append("country", data?.country);
    }
    // @ts-ignore
    if (updatedValues?.image instanceof File) {
      // @ts-ignore
      formData.append("image", updatedValues?.image);
    }
    // @ts-ignore
    if (edit_instance && typeof updatedValues?.image === "string") {
      // @ts-ignore
      formData.append("image", updatedValues?.image);
    }

    // @ts-ignore
    formData.append("specs", formattedSpecs);
    formData.append("year", updatedValues?.year);
    if (updatedValues?.purchase_date) {
      formData.append("purchase_date", updatedValues?.purchase_date);
    }
    formData.append("purchase_price", updatedValues?.purchase_price);
    if (updatedValues?.serial_number) {
      formData.append("serial_number", updatedValues?.serial_number);
    }
    // formData.append("hash_code", updatedValues?.hash_code);

    if (!equipmentId && !edit_instance) {
      const payload = {
        companyId: companyId!,
        payload: formData,
      } as CreateEquipmentRequest;

      return await createEquipment(payload)
        .unwrap()
        .then(async (res) => {
          if (data?.status === "Assigned") {
            const equipmentId = res?.data?.id;
            const payload = {
              companyId: companyId!,
              equipment_id: equipmentId,
              payload: {
                assignee: (updatedValues?.assignee as any) || null,
              },
            } as UpdateEquipmentAssigneeRequest;

            await unAndReAssignEquipmentAssignee(payload)
              .unwrap()
              .then((res) => {
                displaySuccessMessage(
                  "Equipment added successfully",
                  "New equipment has been added to the company roster.",
                );
                if (!removeSubmitRoute) {
                  router.replace("/dashboard/all-equipments");
                }
                reset();
                onClose();
              });
          } else {
            displaySuccessMessage(
              "Equipment added successfully",
              "New equipment has been added to the company roster.",
            );
            if (!removeSubmitRoute) {
              router.replace("/dashboard/all-equipments");
            }
            reset();
            onClose();
          }
        })
        .catch(showApiError);
    } else {
      const payload = {
        companyId: companyId!,
        equipment_id: equipmentId,
        payload: formData,
      } as EditEquipmentRequest;

      return await editEquipment(payload)
        .unwrap()
        .then(async (res) => {
          displaySuccessMessage(
            "Equipment updated successfully",
            "The equipment has been updated in the company roster.",
          );
          if (!removeSubmitRoute) {
            router.replace("/dashboard/all-equipments");
          }
          reset();
          onClose();
          // const payload = {
          //   companyId: companyId!,
          //   equipment_id: equipmentId,
          // };

          // if (
          //   data?.status === "Unassigned" &&
          //   String(equipmentsData?.assignee?.id) &&
          //   equipmentsData?.status !== "Unassigned"
          // ) {
          //   await unassignEquipmentAssignee(payload)
          //     .unwrap()
          //     .then((res) => {
          //       displaySuccessMessage(
          //         "Equipment updated successfully",
          //         "The equipment has been updated in the company roster.",
          //       );
          //       if (!removeSubmitRoute) {
          //         router.replace("/dashboard/all-equipments");
          //       }
          //       reset();
          //       onClose();
          //     });
          // } else {
          //   displaySuccessMessage(
          //     "Equipment updated successfully",
          //     "The equipment has been updated in the company roster.",
          //   );
          //   if (!removeSubmitRoute) {
          //     router.replace("/dashboard/all-equipments");
          //   }
          //   reset();
          //   onClose();
          // }
        })
        .catch(showApiError);
    }
  };

  const [isAddEmployeeInstanceOpen, setIsAddEmployeeInstanceOPen] =
    useState(false);

  useEffect(() => {
    const clearTimer = updateVisibilityAfterDelay(setIsVisible, 3000);
    return clearTimer;
  }, []);

  useEffect(() => {
    if (getEquipValues && !edit_instance) {
      const queryObject = JSON.parse(getEquipValues);

      Object.keys(queryObject).forEach((key: any) => {
        form.setValue(key, queryObject[key]);
      });
    }
  }, [form.setValue, getEquipValues]);

  const handleAddEmployeeToggleClose = () => {
    setIsAddEmployeeInstanceOPen(false);
    const clearTimer = updateVisibilityAfterDelay(setIsVisible, 3000);
    return clearTimer;
  };

  const disableBtnForUnselectedAssignee =
    assetAssignStatus === "Assigned" && !Boolean(assetAssignee);

  return (
    <div className={`pt-5 w-full lg:w-[824px]`}>
      {!isAddEmployeeInstanceOpen ? (
        <>
          {isVisible ? (
            <Form {...form}>
              <form
                className="flex flex-col h-full"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="p-6 grid gap-4 grid-cols-2 h-[calc(100%-154px) pb-[70px] overflow-y-auto">
                  <FormField
                    control={form.control}
                    name="title"
                    label="Asset title"
                    render={({ field: { onChange, ...restField } }) => (
                      <Input
                        placeholder="Add asset title"
                        {...restField}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        data-testid="singleequipment-input"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serial_number"
                    label="Serial number"
                    render={({ field: { onChange, ...restField } }) => (
                      <Input
                        placeholder="Add serial number"
                        {...restField}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        data-testid="singleequipment-input-2"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="make"
                    label="Make"
                    render={({ field: { onChange, ...restField } }) => (
                      <Input
                        placeholder="Add make"
                        {...restField}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        data-testid="singleequipment-input-3"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    label="Model"
                    render={({ field: { onChange, ...restField } }) => (
                      <Input
                        placeholder="Add model"
                        {...restField}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        data-testid="singleequipment-input-4"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    label="Year"
                    render={({ field: { onChange, ...restField } }) => (
                      <Input
                        type="number"
                        placeholder="Add year"
                        {...restField}
                        onChange={(e) => {
                          onChange(String(e.target.value));
                        }}
                        data-testid="singleequipment-input-5"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    label="Asset type"
                    render={({ field: { onChange, value, ...restField } }) => (
                      <Select
                        {...restField}
                        onValueChange={(value) => {
                          onChange(value);
                        }}
                        value={value || undefined}
                        data-testid="singleequipment-select"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>

                        <SelectContent>
                          <EquipmentAssetTypeOptions types={assetTypes} />
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    label="Asset state"
                    render={({ field: { onChange, value, ...restField } }) => (
                      <Select
                        {...restField}
                        onValueChange={(value) => {
                          onChange(value);
                        }}
                        defaultValue={value}
                        data-testid="singleequipment-select-2"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>

                        <SelectContent>
                          {["Brand_New", "Used"].map((value) => (
                            <SelectItem value={value} key={value}>
                              {removeUserscore(value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {!equipmentsData && (
                    <FormField
                      control={form.control}
                      name="status"
                      label="Asset status"
                      render={({
                        field: { onChange, value, ...restField },
                      }) => (
                        <Select
                          {...restField}
                          onValueChange={(value) => {
                            onChange(value);
                          }}
                          defaultValue={value}
                          data-testid="singleequipment-select-3"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Asset status" />
                          </SelectTrigger>

                          <SelectContent className="capitalize">
                            {["Assigned", "Unassigned"].map((value) => (
                              <SelectItem
                                value={value}
                                key={value}
                                className="capitalize"
                              >
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}

                  {(equipmentsData?.status === "Unassigned" ||
                    equipmentsData?.status === "Assigned") &&
                    !edit_instance && (
                      <FormField
                        control={form.control}
                        name="status"
                        label="Asset status"
                        render={({
                          field: { onChange, value, ...restField },
                        }) => (
                          <Select
                            {...restField}
                            onValueChange={(value) => {
                              onChange(value);
                            }}
                            defaultValue={value}
                            data-testid="singleequipment-select-4"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Asset status" />
                            </SelectTrigger>

                            <SelectContent className="capitalize">
                              {["Assigned", "Unassigned"].map((value) => (
                                <SelectItem
                                  value={value}
                                  key={value}
                                  className="capitalize"
                                >
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                            {/* <SelectContent className="capitalize">
                            {["Assigned", "Unassigned"].map((status) => (
                              <SelectItem
                                value={status}
                                key={status}
                                className="capitalize"
                                disabled={
                                  status === "Assigned" && edit_instance
                                }
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent> */}
                          </Select>
                        )}
                      />
                    )}

                  {assetAssignStatus === "Assigned" && !edit_instance && (
                    <FormField
                      control={form.control}
                      name="assignee"
                      label="Select assignee"
                      render={({
                        field: { onChange, value, ...restField },
                      }) => {
                        const defaultInstance = formateEmployeeValueLabel?.find(
                          (item) => item.value === value,
                        );
                        return (
                          <CreatableSelectField
                            options={formateEmployeeValueLabel}
                            onChange={(
                              newValue: OnChangeValue<
                                { value: string; label: string },
                                false
                              >,
                            ) => {
                              onChange(newValue?.value);
                            }}
                            onCreateOption={() => {
                              setIsAddEmployeeInstanceOPen(true);
                              setIsVisible(false);
                            }}
                            placeholder="Select or create assignee"
                            defaultValue={defaultInstance && defaultInstance}
                          />
                        );
                      }}
                    />
                  )}

                  <FormField
                    control={form.control}
                    className="flex flex-col"
                    name="purchase_date"
                    label="Purchase date"
                    render={({ field: { onChange, value, ...restField } }) => (
                      <DatePicker
                        className="w-full h-[44px]"
                        disableFutureDates
                        date={value}
                        placeHolder="Select a purchase date"
                        {...restField}
                        setDate={(value: Date) => {
                          onChange(value);
                        }}
                      />
                    )}
                  />

                  {equipmentSource !== "Rayda" && (
                    <PriceInputField
                      label="Purchase price"
                      name="purchase_price"
                      currencyName="currency_id"
                      className="flex flex-col"
                      data={currenciesData}
                      error={formState.errors.purchase_price}
                      currencyError={formState.errors.currency_id as any}
                      defaultValues={{
                        price: equipmentsData?.purchase_price || "",
                        currency: equipmentsData?.currency?.id || "",
                      }}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="country"
                    label="Select Country"
                    className="col-span-2"
                    render={({ field: { onChange, value, ...restField } }) => (
                      <CountrySelectField
                        onChange={(value) => {
                          onChange(value?.label);
                          setSelectedCountry(value);
                        }}
                        selectedOption={selectedCountry! as any}
                      />
                    )}
                  />

                  <div className="col-span-2">
                    <MultipleSpecFieldGenerator
                      name="properties"
                      availableOptions={availableOptions}
                      control={control}
                      setValue={(name: any, value) => setValue(name, value)}
                    />
                  </div>

                  {/* <FormField
                    control={form.control}
                    name="hash_code"
                    label="Hash code"
                    render={({ field: { onChange, ...restField } }) => (
                      <Input
                        placeholder="Enter hash code"
                        {...restField}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                      />
                    )}
                  /> */}

                  {/* <FormField
                    control={form.control}
                    name="source"
                    label="Source"
                    render={({ field: { onChange, value, ...restField } }) => (
                      <Select
                        {...restField}
                        onValueChange={(value) => {
                          onChange(value);
                        }}
                        defaultValue={value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>

                        <SelectContent>
                          {["Rayda", "External"].map((value) => (
                            <SelectItem value={value} key={value}>
                              {removeUserscore(value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  /> */}

                  {/* <FormField
                    className="col-span-2"
                    control={form.control}
                    name="details"
                    label="Other details (Optional)"
                    render={({ field: { onChange, value, ...restField } }) => (
                      <TagsInput
                        value={value}
                        onChange={onChange}
                        className="bg-white rounded-lg border border-gray-200 px-2 p-1"
                        inputProps={{
                          className:
                            "react-tagsinput-input text-gray-700 w-full placeholder:w-full mb-0",
                          placeholder: "Tab seperated - Enter other details",
                        }}
                        tagProps={{
                          className:
                            "react-tagsinput-tag bg-white text-gray-700 border border-gray-300 rounded-md text-gray-900 text-sm font-medium mt-[5px]",
                          classNameRemove:
                            "react-tagsinput-remove text-gray-400",
                        }}
                      />
                    )}
                  /> */}

                  <div className="col-span-2">
                    <FormFileAttachment
                      height="5.875rem"
                      title="Add asset image (optional)"
                      setImages={setImages}
                      images={images as File[]}
                      showImageList
                    />
                  </div>

                  <FormField
                    className="col-span-2"
                    control={form.control}
                    name="description"
                    label="Description (Optional)"
                    render={({ field: { onChange, ...restField } }) => (
                      <Textarea
                        placeholder="Enter description"
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
                          data-testid="singleequipment-button"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            form?.formState?.isSubmitting ||
                            disableBtnForUnselectedAssignee
                          }
                          className="text-sm font-semibold"
                          data-testid="singleequipment-button-2"
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
        </>
      ) : (
        <AddEmployee
          equipment_instance
          onClose={handleAddEmployeeToggleClose}
          next={() => {}}
        />
      )}
    </div>
  );
};

export default SingleEquipment;
