import { Control } from "react-hook-form";
import { z } from "zod";
import FormField from "@/components/Custom/FormField";
import CountrySelectField from "@/components/CountrySelectField";
import MapLocationFinder from "@/components/MapLocationFinder";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import AddNewEmployeeOrgFields from "./AddNewEmployeeOrgFields";
import { addNewEmployeeSchema } from "./validation";

type FormValues = z.infer<typeof addNewEmployeeSchema>;

type DepartmentOption = { value: string; label: string };

type Props = {
  control: Control<FormValues>;
  selectedCountry?: SingleSelectValue;
  selectedCountryId: string;
  countryCode?: string;
  departmentOptions: DepartmentOption[];
  onCountryChange: (value: SingleSelectValue) => void;
};

const AddNewEmployeeFields = ({
  control,
  selectedCountry,
  selectedCountryId,
  countryCode,
  departmentOptions,
  onCountryChange,
}: Props) => (
  <div className="mt-4 space-y-5">
    <FormField
      control={control}
      name="first_name"
      label="First name"
      render={({ field }) => (
        <Input
          placeholder="Enter first name"
          {...field}
          data-testid="addnewemployeefields-input"
        />
      )}
    />

    <FormField
      control={control}
      name="last_name"
      label="Last name"
      render={({ field }) => (
        <Input
          placeholder="Enter last name"
          {...field}
          data-testid="addnewemployeefields-input-2"
        />
      )}
    />

    <FormField
      control={control}
      name="email"
      label="Email"
      render={({ field }) => (
        <Input
          placeholder="Enter email here"
          type="email"
          {...field}
          data-testid="addnewemployeefields-input-3"
        />
      )}
    />

    <FormField
      control={control}
      name="phone"
      label="Phone number"
      render={({ field: { onChange, ...restField } }) => (
        <PhoneInput
          placeholder="Enter phone number"
          onChange={(value) => onChange(value)}
          {...restField}
        />
      )}
    />

    <FormField
      control={control}
      name="job_title"
      label="Job title"
      render={({ field }) => (
        <Input
          {...field}
          placeholder="Enter job title"
          data-testid="addnewemployeefields-input-4"
        />
      )}
    />

    <FormField
      control={control}
      name="country_id"
      label="Select country"
      render={({ field: { onChange } }) => (
        <CountrySelectField
          onChange={(value) => {
            onChange(value.value);
            onCountryChange(value);
          }}
          selectedOption={selectedCountry! as never}
        />
      )}
    />

    <FormField
      control={control}
      name="address"
      label="Address"
      render={({ field: { onChange, value, ...restField } }) => (
        <MapLocationFinder
          getOfficeLocation={(location) => {
            onChange(location.address);
          }}
          placeholder="Enter Address"
          defaultValue={value}
          reset={!value}
          disabled={!selectedCountryId}
          specificCountry={countryCode}
          {...restField}
        />
      )}
    />

    <AddNewEmployeeOrgFields
      control={control}
      departmentOptions={departmentOptions}
    />
  </div>
);

export default AddNewEmployeeFields;
