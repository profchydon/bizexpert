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

const AzureOD: React.FC<Props> = ({ onContinue }) => {
  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      tenant_id: "",
      client_id: "",
      subscription_id: "",
      client_secret: "",
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
              name="client_id"
              label="Client ID *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx"
                  className="w-full"
                  data-testid="azureod-input"
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
                  data-testid="azureod-input-2"
                />
              )}
            />

            <FormField
              control={form.control}
              name="tenant_id"
              label="Tenant ID *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx"
                  className="w-full"
                  data-testid="azureod-input-3"
                />
              )}
            />

            <FormField
              control={form.control}
              name="subscription_id"
              label="Subscription ID (optional)"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="xxxxx-xxxx"
                  className="w-full"
                  data-testid="azureod-input-4"
                />
              )}
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            type="submit"
            disabled={!form.formState.isValid}
            data-testid="azureod-button"
          >
            Connect
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AzureOD;
