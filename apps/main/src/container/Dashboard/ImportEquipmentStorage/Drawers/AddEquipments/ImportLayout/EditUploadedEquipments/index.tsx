import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { editUploadedEquipmentSchema } from "./validation";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormFileAttachment from "@/components/FormFileAttachment";
import { DatePicker } from "@/components/ui/date-picker";
import TagsInput from "react-tagsinput";
import { removeUserscore } from "@/utils/underScoreTransformer";
import CountrySelectField from "@/components/CountrySelectField";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import routes from "@/routes";
import { useRouter } from "next/navigation";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import EquipmentAssetTypeOptions from "@/container/Dashboard/AllEquipments/Drawers/AddEquipment/EquipmentAssetTypeOptions";

interface Props {
  onClose: () => void;
  edit_instance?: boolean;
  isOpen: boolean;
}
const EditUploadedEquipment: FC<Props> = ({
  onClose,
  isOpen,
  edit_instance = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [images, setImages] = useState<File[] | string[]>();

  const [selectedCountry, setSelectedCountry] = useState<SingleSelectValue>();
  const { data: getCountries } = useGetCountriesQuery();
  const { data: assetTypesRes } = useGetAssetTypesQuery();
  const assetTypes = assetTypesRes?.data;
  const countries = getCountries?.data?.data;
  const router = useRouter();

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
    e.preventDefault();
    router.push(routes.IMPORT_EQUIPMENT_STORAGE);
  };

  const form = useForm<z.infer<typeof editUploadedEquipmentSchema>>({
    resolver: zodResolver(editUploadedEquipmentSchema),

    defaultValues: {
      title: "",
      serial_number: "",
      make: "",
      model: "",
      year: "",
      type: "",
      state: "",
      country: "",
      assignee: "",
      details: [],
      collection_date: "",
      storage_duration: "",
      image: "",
      description: "",
    },
  });

  return (
    <div className={`pt-5 w-full lg:w-[824px]`}>
      <>
        <Form {...form}>
          <form
            className="flex flex-col h-full"
            // onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="p-6 grid gap-4 grid-cols-2 h-[calc(100%-154px) pb-[70px] overflow-y-auto">
              <FormField
                control={form.control}
                name="title"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">Asset title</span>
                    <CircleHelp className="w-4 h-4 text-gray-600" />
                  </div>
                }
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    placeholder="Add asset title"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-testid="edituploadedequipments-input"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="serial_number"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">Serial number</span>
                    <CircleHelp className="w-4 h-4 text-gray-600" />
                  </div>
                }
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    placeholder="Add serial number"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-testid="edituploadedequipments-input-2"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="make"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">Asset make</span>
                    <CircleHelp className="w-4 h-4 text-gray-600" />
                  </div>
                }
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    placeholder="Add make"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-testid="edituploadedequipments-input-3"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="model"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">Model</span>
                    <CircleHelp className="w-4 h-4 text-gray-600" />
                  </div>
                }
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    placeholder="Add model"
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    data-testid="edituploadedequipments-input-4"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="year"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">Year</span>
                    <CircleHelp className="w-4 h-4 text-gray-600" />
                  </div>
                }
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    type="number"
                    placeholder="Add year"
                    {...restField}
                    onChange={(e) => {
                      onChange(String(e.target.value));
                    }}
                    data-testid="edituploadedequipments-input-5"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="type"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">Equipment type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelp className="w-4 h-4 text-gray-600 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <strong>Equipment type</strong>
                          <p className="w-80">
                            Select the category of the Equipments , Examples
                            include Laptop, Desktop, Monitors or other relevant
                            accessories, This helps categorize and track your
                            assets effectively
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                }
                render={({ field: { onChange, value, ...restField } }) => (
                  <Select
                    {...restField}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                    value={value || undefined}
                    data-testid="edituploadedequipments-select"
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
                name="country"
                label={
                  <div className="flex items-center">
                    <span className="font-medium text-sm">Select country</span>
                  </div>
                }
                render={({ field: { onChange, value, ...restField } }) => (
                  <CountrySelectField
                    onChange={(value) => {
                      onChange(value.label);
                      setSelectedCountry(value);
                    }}
                    selectedOption={selectedCountry! as any}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="storage_duration"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">
                      Storage duration
                    </span>
                  </div>
                }
                render={({ field: { onChange, value, ...restField } }) => (
                  <Select
                    {...restField}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                    defaultValue={value}
                    data-testid="edituploadedequipments-select-2"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add storage duration" />
                    </SelectTrigger>

                    <SelectContent className="capitalize">
                      {["5 months", "3 months"].map((value) => (
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

              <FormField
                control={form.control}
                name="state"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">Equipment state</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelp className="w-4 h-4 text-gray-600 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <strong>Equipment state</strong>
                          <p className="w-80">
                            choose the current condition of the equipment,
                            options may include , New(unused), Used(previously
                            owned), Refurbished(professionally restored), This
                            helps manage the life cycle of your asset.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                }
                render={({ field: { onChange, value, ...restField } }) => (
                  <Select
                    {...restField}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                    defaultValue={value}
                    data-testid="edituploadedequipments-select-3"
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

              <FormField
                control={form.control}
                className="flex flex-col"
                name="collection_date"
                label={
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Collection date</span>
                  </div>
                }
                render={({ field: { onChange, value, ...restField } }) => (
                  <DatePicker
                    className="w-full h-[44px]"
                    date={value}
                    placeHolder="Add a collection date"
                    {...restField}
                    setDate={(value: Date) => {
                      onChange(value);
                    }}
                  />
                )}
              />

              <FormField
                className="col-span-2"
                control={form.control}
                name="assignee"
                label={
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Assign to</span>
                  </div>
                }
                render={({ field: { onChange, value, ...restField } }) => (
                  <Select
                    {...restField}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                    defaultValue={value}
                    data-testid="edituploadedequipments-select-4"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>

                    <SelectContent>
                      {["Hi Zik ", "Phony", "Grace", "Olivia"].map((value) => (
                        <SelectItem value={value} key={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="col-span-2">
                <span className="text-sm text-gray-600 font-semibold">
                  if the employee you're looking for isn't in that list, you can
                  add them to the system{" "}
                  <Link href={routes.EMPLOYEES} className="text-primary-600">
                    here
                  </Link>
                </span>
              </div>
              <FormField
                className="col-span-2"
                control={form.control}
                name="details"
                label={
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">
                      Other details (optional) *
                    </span>
                    <CircleHelp className="w-4 h-4 text-gray-600" />
                  </div>
                }
                render={({ field: { onChange, value, ...restField } }) => (
                  <TagsInput
                    value={value}
                    onChange={onChange}
                    className="bg-white rounded-lg border border-gray-200 px-2 p-1"
                    inputProps={{
                      className:
                        "react-tagsinput-input text-gray-700 w-full placeholder:w-full mb-0",
                      placeholder: "e.g., Intel Core i5, 8GB RAM, 256GB SSD",
                    }}
                    tagProps={{
                      className:
                        "react-tagsinput-tag bg-white text-gray-700 border border-gray-300 rounded-md text-gray-900 text-sm font-medium mt-[5px]",
                      classNameRemove: "react-tagsinput-remove text-gray-400",
                    }}
                  />
                )}
              />

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
                label={
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">
                      Specification (Optional)
                    </span>
                  </div>
                }
                render={({ field: { onChange, ...restField } }) => (
                  <Textarea
                    placeholder="Enter specification"
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
                      onClick={handleCancel}
                      data-testid="edituploadedequipments-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={true}
                      className="text-sm font-semibold"
                      data-testid="edituploadedequipments-button-2"
                    >
                      Save equipment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </>
    </div>
  );
};

export default EditUploadedEquipment;
