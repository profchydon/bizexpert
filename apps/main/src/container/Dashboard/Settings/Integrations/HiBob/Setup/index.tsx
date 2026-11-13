import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { setupSchema } from "./validation";
import { ArrowRight } from "lucide-react";
import { blue_check } from "@/assets/icons";
import Image from "next/image";

interface Props {
  onContinue: () => void;
  isConnected: boolean;
  isLoading: boolean;
  onProceedToConfigure: () => void;
}

const Setup: React.FC<Props> = ({
  onContinue,
  isConnected,
  isLoading,
  onProceedToConfigure,
}) => {
  const form = useForm<z.infer<typeof setupSchema>>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      authorize: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof setupSchema>) => {
    onContinue();
  };

  return (
    <div>
      <div className="font-medium text-sm flex items-center gap-x-2">
        {!isConnected ? (
          <>Connect Your HiBob Account</>
        ) : (
          <div className="font-medium text-sm flex items-center gap-x-2">
            HiBob connected successfully
            <Image
              src={blue_check}
              alt="Success Check"
              width={20}
              height={20}
            />
          </div>
        )}
      </div>

      <Separator className="my-3" />
      {!isConnected ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full lg:min-w-[27rem]"
          >
            <div className="flex flex-col gap-5 mt-8 ">
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
                          Allow Rayda to access employee data on HiBob ID on
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
              disabled={!form.formState.isValid || isLoading}
              data-testid="setup-button"
            >
              Connect
            </Button>
          </form>
        </Form>
      ) : (
        <Button
          variant="primary"
          className="w-full mt-6"
          onClick={onProceedToConfigure}
          data-testid="setup-button-2"
        >
          Proceed to Configure
          <ArrowRight className="pl-2" />
        </Button>
      )}
    </div>
  );
};
export default Setup;
