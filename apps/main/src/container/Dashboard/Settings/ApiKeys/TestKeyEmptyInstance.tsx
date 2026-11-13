import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React, { FC } from "react";
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
import { ISubscription } from "@/types/subscriptions";
import Image from "next/image";
import { empty_apitest_image } from "@/assets/images";
import { useRouter } from "next/navigation";
import routes from "@/routes";

interface Props {
  planName: string;
}
const TestKeyEmptyInstance: FC<Props> = ({ planName }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof ApiKeysSchema>>({
    resolver: zodResolver(ApiKeysSchema),
    defaultValues: {
      secret_key: "•••••••••••••••••••••••",
    },
  });

  const onSubmit = (data: z.infer<typeof ApiKeysSchema>) => {};

  return (
    <>
      <Card className="relative flex flex-col justify-center">
        <div className="absolute inset-0 w-full h-full backdrop-blur-sm z-[100]"></div>
        <div className="absolute z-[101] inset-0 flex flex-col items-center justify-center gap-y-6 p-4 mx-auto">
          <div className="max-w-[22rem] flex flex-col items-center justify-center text-center gap-y-6">
            <Image src={empty_apitest_image} alt="live_key_empty_instance" />
            <div className="flex flex-col gap-y-2">
              <p className="text-xl font-semibold text-gray-900">
                {planName} can’t access your API keys
              </p>
              <p className="text-base text-gray-600">
                To get API access you need to upgrade your plan
              </p>
            </div>
            <Button
              className="text-sm font-semibold flex flex-row gap-x-3 items-center"
              onClick={() => router.push(routes.SETTINGS_SUBSCRIPTION)}
              data-testid="testkeyemptyinstance-button"
            >
              Upgrade plan
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-y-5 pt-4">
              <FormField
                control={form.control}
                name="secret_key"
                label="Test secret key"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="wait for secret key"
                    disabled={true}
                    {...field}
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
                    placeholder="pk_live_dcda8df89ed8516133b9d79e1ea7b1c5"
                    disabled={true}
                    onChange={field.onChange}
                  />
                )}
              />
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
                    data-testid="testkeyemptyinstance-input"
                  />
                )}
              />
            </CardContent>
            <CardFooter className="border-t bg-white py-4">
              <div className="flex gap-x-6 ml-auto">
                <Button
                  className="text-sm font-semibold "
                  variant="outline"
                  data-testid="testkeyemptyinstance-button-2"
                >
                  Generate new APIs
                </Button>
                <Button
                  className="text-sm font-semibold"
                  data-testid="testkeyemptyinstance-button-3"
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

export default TestKeyEmptyInstance;
