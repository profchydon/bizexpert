"use client";

import { Control } from "react-hook-form";
import { z } from "zod";
import FormField from "@/components/Custom/FormField";
import CustomCreatableSelectField, {
  Option,
} from "@/components/CustomCreatableMultipleSelectField";
import { FormItem } from "@/components/ui/form";
import { notificationSchema } from "./validation";

type Values = z.infer<typeof notificationSchema>;

interface Props {
  control: Control<Values>;
  name: "notification.orders" | "notification.billing" | "notification.support";
  title: string;
  existingEmails: string[];
}

export function NotificationEmailField({
  control,
  name,
  title,
  existingEmails,
}: Props) {
  const helper =
    title === "Account Billing" ? "account billing" : title.toLowerCase();

  return (
    <FormField
      control={control}
      className="w-full"
      name={name}
      label=""
      render={({ field: { onChange, value } }) => {
        const selectedValues = value || [];
        const options = Array.from(
          new Set([...selectedValues, ...existingEmails]),
        ).map((email) => ({ label: email, value: email }));

        return (
          <FormItem className="w-full">
            <CustomCreatableSelectField
              isMulti
              options={options}
              value={selectedValues.map((email: string) => ({
                label: email,
                value: email,
              }))}
              onChange={(next) =>
                onChange((next as Option[]).map((option) => option.value))
              }
              onCreateOption={(inputValue) =>
                onChange([...(value || []), inputValue])
              }
              placeholder={`Select or type email address(es) for ${helper}`}
            />
            <p className="text-sm font-normal text-gray-600">
              Add email address(es) for {helper} notifications.
            </p>
          </FormItem>
        );
      }}
    />
  );
}
