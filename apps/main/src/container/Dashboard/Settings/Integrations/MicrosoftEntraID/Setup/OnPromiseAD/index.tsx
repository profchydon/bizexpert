import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setupFormSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onContinue: () => void;
}

const OnPromiseAD: React.FC<Props> = ({ onContinue }) => {
  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      domain_ip: "",
      domain_name: "",
      username: "",
      password: "",
      ldap_port: "",
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
              name="domain_ip"
              label="Domain Controller IP *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="000.000.0.0"
                  className="w-full"
                  type="number"
                  data-testid="onpromisead-input"
                />
              )}
            />

            <FormField
              control={form.control}
              name="domain_name"
              label="Domain Name *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="yourcompany.com"
                  className="w-full"
                  data-testid="onpromisead-input-2"
                />
              )}
            />

            <FormField
              control={form.control}
              name="username"
              label="Username *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Username"
                  className="w-full"
                  data-testid="onpromisead-input-3"
                />
              )}
            />

            <FormField
              control={form.control}
              name="password"
              label="Password *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="••••••••"
                  type="password"
                  className="w-full"
                  data-testid="onpromisead-input-4"
                />
              )}
            />

            <FormField
              control={form.control}
              name="ldap_port"
              label="LDAP Port *"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="000"
                  type="password"
                  className="w-full"
                  data-testid="onpromisead-input-5"
                />
              )}
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            type="submit"
            disabled={!form.formState.isValid}
            data-testid="onpromisead-button"
          >
            Connect
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OnPromiseAD;
