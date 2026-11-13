import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ApiKeysSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormField from "@/components/Custom/FormField";
import { PasswordInput } from "@/components/ui/password-input";
import CopyInput from "@/components/CopyInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ICredentials } from "@/types/credential";
import { CircleHelp } from "lucide-react";
import { Plus } from "lucide-react";
import CopyablePasswordField from "@/components/CopyablePasswordField";

interface Props {
  testKeyData: ICredentials | undefined | null;
  handleGenerate: () => void;
  isLoadingKey: boolean;
  handleSave: (callback_url: string, webhook_url: string) => void;
  tabValue: string;
  isSavingUrl: boolean;
}

const TestApiKeys: FC<Props> = ({
  testKeyData,
  handleGenerate,
  isLoadingKey,
  isSavingUrl,
  handleSave,
  tabValue,
}) => {
  const form = useForm<z.infer<typeof ApiKeysSchema>>({
    resolver: zodResolver(ApiKeysSchema),
  });

  useEffect(() => {
    if (testKeyData && tabValue === "test") {
      Object.keys(testKeyData).forEach((key: any) => {
        // @ts-ignore
        form.setValue(key, testKeyData[key] || "");
      });
    }
  }, [testKeyData, tabValue, form.setValue]);

  const onSubmit = (data: z.infer<typeof ApiKeysSchema>) => {
    const callback_url = data?.callback_url as string;
    const webhook_url = data?.webhook_url as string;
    handleSave(callback_url, webhook_url);
  };

  return (
    <>
      <Card className="relative flex flex-col justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-y-5 pt-4">
              <div className="grid grid-cols-2 gap-x-8 w-full items-start items-center">
                <FormField
                  control={form.control}
                  name="secret_key"
                  label="Test secret key"
                  render={({ field }) => (
                    <CopyablePasswordField
                      value={field.value || ""}
                      disabled={true}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="public_key"
                  label="Test public key"
                  render={({ field }) => (
                    <CopyInput
                      value={field.value || ""}
                      placeholder="pk_test_dcda8df89ed8516133b9d79e1ea7b1c5"
                      disabled={true}
                      onChange={field.onChange}
                    />
                  )}
                />
                {/* <div className="flex flex-col items-start space-y-1 mt-2">
                  <div className="flex flex-row space-x-2 items-center">
                    <span className="font-medium text-sm text-gray-500">
                      Ip whitelist
                    </span>
                    <CircleHelp className="w-3 h-3 text-gray-400" />
                  </div>
                  <Button
                    className="bg-primary-50 w-full space-x-2"
                    data-testid="testapikeys-button"
                  >
                    <Plus className="w-4 h-4 text-primary-700 font-semibold" />
                    <span className="text-primary-700 text-base font-semibold">
                      Add IP Address
                    </span>
                  </Button>
                </div> */}
              </div>

              <FormField
                control={form.control}
                name="callback_url"
                label="Test callback URL"
                render={({ field }) => (
                  <CopyInput
                    value={field.value || ""}
                    placeholder="https://remotebackend.rayda.co/api/v1/payment"
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="webhook_url"
                label="Test webhook URL"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="https://example.com"
                    className="w-full"
                    data-testid="testapikeys-input"
                  />
                )}
              />
            </CardContent>
            <CardFooter className="border-t bg-white py-4">
              <div className="flex gap-x-6 ml-auto">
                <Button
                  className="text-sm font-semibold "
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={isLoadingKey}
                  data-testid="testapikeys-button"
                >
                  Generate new APIs
                </Button>
                <Button
                  className="text-sm font-semibold"
                  disabled={isSavingUrl}
                  data-testid="testapikeys-button-2"
                >
                  Save changes
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default TestApiKeys;
