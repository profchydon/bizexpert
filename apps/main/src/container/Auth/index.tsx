"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "./validation";
import { Button } from "@/components/ui/button";
import { logo_black } from "@/assets/images/";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import loginBanner from "@/assets/images/loginBanner.svg";
import routes from "@/routes";
import { useLoginAuthorizationMutation } from "@/api/baseQueries/authFlowApi/loginAuthorization";
import { useAppDispatch } from "@/store";
import { assignSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { showApiError } from "@/utils/showApiError";

const Auth = () => {
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {};

  const [loginAuthorization, loginAuthorizationProps] =
    useLoginAuthorizationMutation();

  const onLogin = async () => {
    clearClientAuthSession(dispatch, { preservePostLoginRedirect: true });

    try {
      const session = await loginAuthorization().unwrap();
      if (!assignSafeRedirectUrl(session.data.redirect_url)) {
        displayErrorMessage(
          "We couldn't start sign in.",
          "The sign-in address from the server was not a valid http or https URL.",
        );
      }
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <div className="lg:w-1/2">
        <div className="lg:grid px-10 sm:px-24 lg:px-0 place-content-center h-screen">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full lg:min-w-[27rem]"
            >
              <div className="flex flex-col gap-y-2 mb-4 lg:gap-y-0 lg:flex-row md:justify-between pb-8">
                <Image src={logo_black} alt="Rayda Logo" />
              </div>

              <div className="space-y-3 flex flex-col">
                <h1 className="text-3xl font-medium text-gray-900">Log in</h1>
                <p className="text-sm">
                  Seamlessly access all Rayda services with the same login
                  details
                </p>
              </div>

              <Button
                variant="primary"
                className="w-full mt-6"
                // disabled={!form?.formState?.isValid}
                disabled={loginAuthorizationProps.isLoading}
                isLoading={loginAuthorizationProps.isLoading}
                onClick={onLogin}
                data-testid="auth-button"
              >
                Sign In
              </Button>

              <Link href={routes.ONBOARDING}>
                <div className="mt-8 text-center">
                  <span className="text-sm font-normal">
                    {" "}
                    Don't have an account?
                  </span>{" "}
                  <span className="text-primary-700 text-sm font-semibold">
                    Sign up
                  </span>
                </div>
              </Link>
            </form>
          </Form>
        </div>
      </div>

      <div className="h-screen lg:fixed lg:top-0 lg:w-1/2 lg:right-0 hidden lg:block">
        <Image
          src={loginBanner}
          alt="login-banner"
          className="w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Auth;
