import { Form } from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setupFormSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onSave: (data: { orgId: string }) => void | Promise<void>;
  initialOrgId?: string;
  isLoading?: boolean;
  isLive?: boolean;
  settings_instance?: boolean;
}

const Setup: React.FC<Props> = ({
  onSave,
  initialOrgId = "",
  isLoading = false,
  isLive = false,
  settings_instance = false,
}) => {
  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    mode: "onChange",
    defaultValues: {
      abm_id: initialOrgId,
    },
  });

  useEffect(() => {
    form.reset({ abm_id: initialOrgId });
  }, [form, initialOrgId]);

  const onSubmit = async (data: z.infer<typeof setupFormSchema>) => {
    const valueData = {
      orgId: data?.abm_id as string,
    };
    await onSave(valueData);
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
              name="abm_id"
              label="ABM ID"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="ORG-12345678"
                  className="w-full"
                  data-testid="setup-input"
                />
              )}
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            type="submit"
            isLoading={isLoading || form.formState.isSubmitting}
            disabled={
              !form.formState.isValid ||
              isLoading ||
              form.formState.isSubmitting
            }
            data-testid="setup-button"
          >
            {!settings_instance ? "Save" : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Setup;
