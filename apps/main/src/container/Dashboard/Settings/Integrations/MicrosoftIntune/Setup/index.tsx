import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setupFormSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  onContinue: () => void;
}

const Setup: React.FC<Props> = ({ onContinue }) => {
  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      tenant_id: "",
      client_id: "",
      client_secret: "",
      authorize: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof setupFormSchema>) => {
    onContinue();
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full lg:min-w-[27rem]"
        >
          <div className="flex flex-col gap-5 mt-4">
            <FormField
              control={form.control}
              name="tenant_id"
              label="Tenant ID *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx"
                  className="w-full"
                  type="email"
                  data-testid="setup-input"
                />
              )}
            />

            <FormField
              control={form.control}
              name="client_id"
              label="Client ID *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx"
                  className="w-full"
                  data-testid="setup-input-2"
                />
              )}
            />

            <FormField
              control={form.control}
              name="client_secret"
              label="Client Secret *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="xxxxxxxxxx"
                  className="w-full"
                  data-testid="setup-input-3"
                />
              )}
            />

            <FormField
              control={form.control}
              name="authorize"
              label=""
              render={({ field }) => (
                <div className="flex gap-x-2">
                  <Checkbox
                    checked={field.value}
                    id="authorize"
                    onCheckedChange={field.onChange}
                    data-testid="setup-checkbox"
                  />
                  <div>
                    <Label
                      htmlFor="authorize"
                      className="text-sm flex flex-col gap-y-1"
                    >
                      <span>Authorize</span>
                      <span className="text-gray-600 font-normal">
                        Allow Rayda to manage devices on Microsoft Intune on
                        your behalf.
                      </span>
                    </Label>
                  </div>
                </div>
              )}
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            type="submit"
            disabled={!form.formState.isValid}
            data-testid="setup-button"
          >
            Connect
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Setup;
