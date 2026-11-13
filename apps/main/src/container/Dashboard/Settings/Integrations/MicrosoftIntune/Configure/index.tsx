import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setupFormSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PhoneInput } from "@/components/ui/phone-input";
import EmptyTableInstance from "@/components/EmptyTableInstance";

interface Props {
  onContinue: () => void;
  isConnected: boolean;
}

const Configure: React.FC<Props> = ({ onContinue, isConnected }) => {
  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      notification_email: "",
      activity_log: false,
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof setupFormSchema>) => {
    onContinue();
  };

  return (
    <div>
      {!isConnected && (
        <EmptyTableInstance
          description="Setup integration to configure"
          title="Setup integration to continue."
        />
      )}
      {isConnected && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full lg:min-w-[27rem]"
          >
            <div className="flex flex-col gap-5 mt-4">
              <div className="text-sm font-semibold text-primary-700">
                Notification and Logging Preferences
              </div>

              <FormField
                control={form.control}
                name="notification_email"
                label="Notification Email *"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Notification Email *"
                    className="w-full"
                    type="email"
                    data-testid="configure-input"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="activity_log"
                label=""
                render={({ field }) => (
                  <div className="flex justify-between gap-x-2">
                    <Label htmlFor="activity_log">
                      Enable Activity Logging
                    </Label>
                    <Switch
                      id="activity_log"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <div className="text-sm font-semibold text-primary-700">
                Support Information
              </div>

              <FormField
                control={form.control}
                name="name"
                label="Support Contact Name *"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Name *"
                    className="w-full"
                    data-testid="configure-input-2"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="email"
                label="Support Contact Email *"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter email *"
                    className="w-full"
                    data-testid="configure-input-3"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                label="Phone number"
                render={({ field }) => (
                  <PhoneInput onChange={(value) => field.onChange(value)} />
                )}
              />
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              type="submit"
              disabled={!form.formState.isValid}
              data-testid="configure-button"
            >
              Finish
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Configure;
