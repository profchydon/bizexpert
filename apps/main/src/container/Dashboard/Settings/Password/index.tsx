import React, { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "@/components/Custom/FormField";
import { passwordSchema } from "./validation";

const Password = () => {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof passwordSchema>) => {};

  return (
    <div className="border-t pt-4 gap-y-8">
      <div className="border-b pb-4">
        <h1 className="font-semibold text-lg">Password</h1>
        <span className="font-normal text-sm">
          Please enter your current password to change your password.
        </span>
      </div>

      <div className="gap-y-5 pt-4">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5 pt-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                label="Current password"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Enter your current password"
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                label="New password"
                render={({ field: { onChange, ...rest } }) => (
                  <PasswordInput
                    placeholder="Enter your new password"
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    {...rest}
                  />
                )}
              />
              <FormMessage />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                label="Confirm new password"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Confirm your new password"
                    {...field}
                  />
                )}
              />
              <div className=" border-t bg-white px-6 py-4 ">
                <div className="grid place-content-end my-auto h-full w-full">
                  <div className="flex gap-x-6">
                    <Button
                      className="text-sm font-semibold "
                      variant="outline"
                      data-testid="password-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="text-sm font-semibold"
                      data-testid="password-button-2"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Password;
