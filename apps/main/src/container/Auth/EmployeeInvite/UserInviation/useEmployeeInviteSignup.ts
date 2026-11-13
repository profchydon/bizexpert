import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import routes from "@/routes";
import { IAcceptInvitationRequest, IUserInvitation } from "@/types/employees";
import { entityAdminEmployeeSignupSuccessMessage } from "@/container/Auth/EntityAdminInvite/entityAdminInviteCopy";
import { trackEntityAdminInvite } from "@/lib/entityAdminInviteAnalytics";
import { useAcceptUserInvitationMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/acceptInvitation";
import { useGetJoinRequestUserDetailsQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getJoinRequestUserDetails";
import { useJoinRequestSignupMutation } from "@/api/baseQueries/companiesApi/dashboardApi/joinRequestSignup";
import { signupFormSchema } from "./validation";
import {
  INVITE_JOIN_REQUEST_STORAGE_KEY,
  useEmployeeInviteJoinRequestMeta,
} from "./useEmployeeInviteJoinRequestMeta";
import { useEmployeeInviteVerificationRedirect } from "./useEmployeeInviteVerificationRedirect";

type JoinRequestUserDetails = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";

type SignupFormValues = z.infer<typeof signupFormSchema>;

interface Options {
  invitation: IUserInvitation | null;
  isEntityAdminFlow: boolean;
}

export function useEmployeeInviteSignup({
  invitation,
  isEntityAdminFlow,
}: Options) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const joinRequestMeta = useEmployeeInviteJoinRequestMeta(invitation);
  const { buildVerificationRedirect, next, verificationToken } =
    useEmployeeInviteVerificationRedirect(invitation);

  const [acceptInvitation, acceptInvitationProps] =
    useAcceptUserInvitationMutation();
  const [joinRequestSignup, joinRequestSignupProps] =
    useJoinRequestSignupMutation();
  const { data: joinRequestUserDetails } = useGetJoinRequestUserDetailsQuery(
    {
      companyId: joinRequestMeta.companyId,
      joinRequestId: joinRequestMeta.joinRequestId,
    },
    {
      skip: !joinRequestMeta.companyId || !joinRequestMeta.joinRequestId,
    },
  );

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      first_name: invitation?.user?.first_name || "",
      last_name: invitation?.user?.last_name || "",
      email: invitation?.email || "",
      phone: invitation?.user?.phone || "",
      job_title: invitation?.user?.job_title || "",
      address: invitation?.user?.address || "",
      employment_type: invitation?.user?.employment_type || "",
      password: "",
    },
  });

  useEffect(() => {
    const userDetails = joinRequestUserDetails?.data as
      | JoinRequestUserDetails
      | undefined;

    if (!userDetails) {
      return;
    }

    if (userDetails.first_name) {
      form.setValue("first_name", userDetails.first_name, {
        shouldDirty: false,
      });
    }
    if (userDetails.last_name) {
      form.setValue("last_name", userDetails.last_name, {
        shouldDirty: false,
      });
    }
    if (userDetails.email) {
      form.setValue("email", userDetails.email, {
        shouldDirty: false,
      });
    }
  }, [form, joinRequestUserDetails]);

  const onSubmit = form.handleSubmit(async (data) => {
    const userPayload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || invitation?.email,
      phone: data.phone,
      password: data.password,
      address: data.address,
      job_title: data.job_title,
      employment_type: data.employment_type,
    };

    if (joinRequestMeta.joinRequestId) {
      if (!joinRequestMeta.companyId) {
        displayErrorMessage("Unable to complete signup. Missing company ID.");
        return;
      }

      const { success, message } = await joinRequestSignup({
        companyId: joinRequestMeta.companyId,
        payload: {
          email: userPayload.email || "",
          first_name: userPayload.first_name,
          last_name: userPayload.last_name,
          phone: userPayload.phone,
          password: userPayload.password,
          address: userPayload.address || "",
          job_title: userPayload.job_title || "",
          employment_title: userPayload.employment_type || "",
        },
      }).unwrap();

      if (success) {
        sessionStorage.removeItem(INVITE_JOIN_REQUEST_STORAGE_KEY);
        displaySuccessMessage(message);
        router.push(`${routes.LOGIN}?switch_account=1`);
      }
      return;
    }

    const payload = {
      code: invitation?.code,
      payload: userPayload,
    } as IAcceptInvitationRequest;

    const { success, message } = await acceptInvitation(payload).unwrap();

    if (success) {
      if (isEntityAdminFlow) {
        displaySuccessMessage(
          message || entityAdminEmployeeSignupSuccessMessage(),
        );
        if (invitation?.id) {
          trackEntityAdminInvite({
            action: "completed",
            invitation_id: invitation.id,
          });
        }
        router.push(`${routes.LOGIN}?switch_account=1`);
        return;
      }

      displaySuccessMessage(message);

      if (next === "verification" && verificationToken) {
        if (globalThis.window !== undefined) {
          globalThis.window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
        }
        router.push(buildVerificationRedirect());
        return;
      }

      router.push(`${routes.LOGIN}?switch_account=1`);
    }
  });

  return {
    form,
    password,
    setPassword,
    isPasswordValid,
    setIsPasswordValid,
    onSubmit,
    acceptInvitationProps,
    joinRequestSignupProps,
  };
}
