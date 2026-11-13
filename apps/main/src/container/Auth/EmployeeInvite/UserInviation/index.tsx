import React from "react";
import Link from "next/link";
import Image from "next/image";
import { logo_black as logo } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import routes from "@/routes";
import type { EntityAdminInvitation } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitationTypes";
import { EntityAdminEmployeeSignupIntro } from "@/container/Auth/EntityAdminInvite/EntityAdminEmployeeSignupIntro";
import { IUserInvitation } from "@/types/employees";
import { EmployeeInviteSignupFields } from "./EmployeeInviteSignupFields";
import { useEmployeeInviteSignup } from "./useEmployeeInviteSignup";

interface Props {
  invitation: IUserInvitation | null;
  entityAdminInvitation?: EntityAdminInvitation | null;
  isEntityAdminFlow?: boolean;
}

const UserInviation: React.FC<Props> = ({
  invitation,
  entityAdminInvitation = null,
  isEntityAdminFlow = false,
}) => {
  const {
    form,
    password,
    setPassword,
    isPasswordValid,
    setIsPasswordValid,
    onSubmit,
    acceptInvitationProps,
    joinRequestSignupProps,
  } = useEmployeeInviteSignup({
    invitation,
    isEntityAdminFlow,
  });

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={onSubmit} className="w-full lg:min-w-[27rem]">
          {isEntityAdminFlow && entityAdminInvitation ? (
            <EntityAdminEmployeeSignupIntro
              invitation={entityAdminInvitation}
              inviterName={invitation?.invited_by?.first_name}
            />
          ) : (
            <div className="mb-6 flex flex-col gap-y-3">
              <Image src={logo} alt="rayda_logo" />
              <div className="text-2xl font-semibold text-gray-900 lg:text-3xl">
                Sign up
              </div>
              <span className="block max-w-md text-base text-gray-600">
                {invitation?.invited_by?.first_name} has invited you, kindly
                sign up to join Rayda.
              </span>
            </div>
          )}

          <EmployeeInviteSignupFields
            control={form.control}
            password={password}
            setPassword={setPassword}
            setIsPasswordValid={setIsPasswordValid}
          />

          <Button
            variant="primary"
            className="mt-6 w-full"
            type="submit"
            disabled={
              !isPasswordValid ||
              acceptInvitationProps.isLoading ||
              joinRequestSignupProps.isLoading
            }
            data-testid="userinviation-button"
          >
            {isEntityAdminFlow ? "Create account & continue" : "Get started"}
          </Button>

          <Link href={routes.LOGIN}>
            <div className="mb-2 mt-8 text-center">
              <span className="text-sm"> Already have an account?</span>{" "}
              <span className="font-medium text-primary-700">Log in</span>
            </div>
          </Link>
        </form>
      </Form>
    </div>
  );
};

export default UserInviation;
