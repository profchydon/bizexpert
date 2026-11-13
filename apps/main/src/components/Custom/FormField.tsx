import React from "react";
import {
  FormControl,
  FormField as HookFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";

interface Props {
  control?: any;
  name: string;
  label: string | React.ReactNode;
  className?: string;
  render: ({
    field,
    fieldState,
  }: {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
  }) => React.ReactNode;
}

const FormField: React.FC<Props> = ({
  control,
  name,
  label,
  render,
  className,
}) => {
  return (
    <HookFormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{render({ field, fieldState })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
