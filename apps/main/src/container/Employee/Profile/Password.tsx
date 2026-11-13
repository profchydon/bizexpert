import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordFormSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import FormField from "@/components/Custom/FormField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

const Password = () => {
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof passwordFormSchema>) => {};

  return (
    <Form {...form}>
      <div className="mb-4 mt-6">
        <h2 className="text-lg text-gray-900 font-semibold">Password</h2>
        <span className="text-sm">Update your password here.</span>
      </div>

      <Separator className="my-6" />

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="current_password"
          label=""
          render={({ field: { onChange, ...rest } }) => (
            <div className="grid grid-cols-[30%,1fr] gap-x-3">
              <Label className="text-sm font-medium">Current password</Label>
              <div className="w-[52.5ch]">
                <PasswordInput
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  {...rest}
                />
              </div>
            </div>
          )}
        />

        <Separator className="my-6" />

        <FormField
          control={form.control}
          name="new_password"
          label=""
          render={({ field: { onChange, ...rest } }) => (
            <div className="grid grid-cols-[30%,1fr] gap-x-3">
              <Label className="text-sm font-medium">New password</Label>
              <div className="w-[52.5ch]">
                <PasswordInput
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  {...rest}
                />
              </div>
            </div>
          )}
        />

        <Separator className="my-6" />

        <FormField
          control={form.control}
          name="confirm_password"
          label=""
          render={({ field: { onChange, ...rest } }) => (
            <div className="grid grid-cols-[30%,1fr] gap-x-3">
              <Label className="text-sm font-medium">
                Confirm new password
              </Label>
              <div className="w-[52.5ch]">
                <PasswordInput
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  {...rest}
                />
              </div>
            </div>
          )}
        />

        <Separator className="my-6" />

        <div className="grid place-content-end ">
          <div className="flex gap-x-3">
            <Button variant={"outline"} data-testid="password-button">
              Cancel
            </Button>
            <Button data-testid="password-button-2">Update password</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Password;
