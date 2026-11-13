import TagsInput from "@/components/TagsInput";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { inviteEmployeeSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import FormField from "@/components/Custom/FormField";
import { removeUserscore } from "@/utils/underScoreTransformer";
import useDepartment from "@/hooks/useDepartment";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { Form } from "@/components/ui/form";
import { useInviteEmployeesMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/inviteEmployees";

interface Props {
  onClose: () => void;
}
const SendInvite: React.FC<Props> = ({ onClose }) => {
  const form = useForm<z.infer<typeof inviteEmployeeSchema>>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: {
      emails: "",
    },
  });

  const [emails, setEmails] = useState<string[]>([]);
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const [inviteAdmins, inviteAdminsProps] = useInviteEmployeesMutation();

  const onSubmit = async (values: any) => {
    const data = {
      companyId: company?.id as string,
      payload: {
        emails,
        role: "Administrator",
      },
    };

    await inviteAdmins(data)
      .unwrap()
      .then((res) => {
        displaySuccessMessage("Invites sent successfully");
        form.reset();
        setEmails([]);
        onClose();
      })
      .catch(showApiError);
  };

  return (
    <Form {...form}>
      <form className="mb-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="emails"
            label="Add emails"
            render={({ field: { onChange, value, ...restField } }) => (
              <div className="flex flex-col gap-y-3 mb-3">
                <div>
                  <TagsInput
                    setValues={(value) => {
                      setEmails(value);
                      onChange(value.join(","));
                    }}
                    values={emails}
                  />
                </div>
                <div className="text-gray-600 text-xs">
                  Add all the employees you want to invite here{" "}
                  <span className="text-error-700">
                    (Press tab button to enter multiple email addresses).
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        <DrawerFooter
          onClose={onClose}
          onSubmit={() => null}
          submitButtonType="submit"
          disableSubmitButton={
            inviteAdminsProps.isLoading || emails.length === 0
          }
        />
      </form>
    </Form>
  );
};

export default SendInvite;
