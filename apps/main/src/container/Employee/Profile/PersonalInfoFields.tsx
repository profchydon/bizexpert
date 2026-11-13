import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import FormField from "@/components/Custom/FormField";
import DepartmentField from "@/components/DepartmentField";
import MapLocationFinder from "@/components/MapLocationFinder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import routes from "@/routes";
import { profileFormSchema } from "./validation";

type FormValues = z.infer<typeof profileFormSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
  departments?: { id: string; name: string }[];
  isSaving: boolean;
  onSubmit: (data: FormValues) => void;
};

const PersonalInfoFields = ({
  form,
  departments,
  isSaving,
  onSubmit,
}: Props) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
    <FormField
      control={form.control}
      name="first_name"
      label=""
      render={({ field }) => (
        <div className="grid grid-cols-[30%,1fr] gap-x-3">
          <Label className="text-sm font-medium">First Name</Label>
          <Input
            placeholder="Enter your first name"
            {...field}
            className="w-[60ch]"
            data-testid="personalinfofields-input"
          />
        </div>
      )}
    />
    <Separator className="my-6" />
    <FormField
      control={form.control}
      name="last_name"
      label=""
      render={({ field }) => (
        <div className="grid grid-cols-[30%,1fr] gap-x-3">
          <Label className="text-sm font-medium">Last Name</Label>
          <Input
            placeholder="Enter your last name"
            {...field}
            className="w-[60ch]"
            data-testid="personalinfofields-input-2"
          />
        </div>
      )}
    />
    <Separator className="my-6" />
    <FormField
      control={form.control}
      name="phone"
      label=""
      render={({ field }) => (
        <div className="grid grid-cols-[30%,1fr] gap-x-3">
          <Label className="text-sm font-medium">Phone number</Label>
          <div className="!w-[52.5ch]">
            <PhoneInput
              onChange={(value) => field.onChange(value)}
              value={field.value}
            />
          </div>
        </div>
      )}
    />
    <Separator className="my-6" />
    <div className="pointer-events-none opacity-70">
      <FormField
        control={form.control}
        name="email"
        label=""
        render={({ field }) => (
          <div className="grid grid-cols-[30%,1fr] gap-x-3">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              {...field}
              type="email"
              className="w-[60ch]"
              readOnly
              disabled
              data-testid="personalinfofields-input-3"
            />
          </div>
        )}
      />
    </div>
    <Separator className="my-6" />
    <FormField
      control={form.control}
      name="department"
      label=""
      render={() => (
        <div className="grid grid-cols-[30%,1fr] gap-x-3">
          <Label className="text-sm font-medium">Department</Label>
          <div className="!w-[52.5ch]">
            <DepartmentField
              onChange={() => {}}
              isDisabled
              defaultValue={
                departments?.map((dept) => ({
                  value: dept.id,
                  label: dept.name,
                }))!
              }
            />
          </div>
        </div>
      )}
    />
    <Separator className="my-6" />
    <FormField
      control={form.control}
      name="address"
      label=""
      render={({ field: { onChange, value, ...restField } }) => (
        <div className="grid grid-cols-[30%,1fr] gap-x-3">
          <Label className="text-sm font-medium">Address</Label>
          <div className="!w-[52.5ch]">
            <MapLocationFinder
              getOfficeLocation={(location) => {
                onChange(location.address);
              }}
              placeholder="Enter Address"
              defaultValue={value}
              reset={!value}
              {...restField}
            />
          </div>
        </div>
      )}
    />
    <Separator className="my-6" />
    <div className="grid place-content-end ">
      <div className="flex gap-x-3">
        <Link href={routes.EMPLOYEE}>
          <Button
            variant={"outline"}
            disabled={isSaving}
            data-testid="personalinfofields-button"
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSaving}
          data-testid="personalinfofields-button-2"
        >
          Save
        </Button>
      </div>
    </div>
  </form>
);

export default PersonalInfoFields;
