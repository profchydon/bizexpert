import React from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { declineSchema } from "./validation";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/components/Custom/FormField";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useRejectEmployeeRequestMutation } from "@/api/baseQueries/companiesApi/employeesApi/rejectEmployeeRequest";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { IEmployeeRequest } from "@/types/employees";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeeReq: IEmployeeRequest;
}

const DeclineReason: React.FC<Props> = ({ isOpen, onClose, employeeReq }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const form = useForm<z.infer<typeof declineSchema>>({
    resolver: zodResolver(declineSchema),
    defaultValues: {
      rejection: "",
    },
  });

  const [rejectReq, rejectReqProps] = useRejectEmployeeRequestMutation();

  const onSubmit = async (data: z.infer<typeof declineSchema>) => {
    await rejectReq({
      companyId: companyId!,
      reason: data.rejection,
      reqId: employeeReq?.id,
    })
      .unwrap()
      .then((res) => {
        displaySuccessMessage("Rejected successfully");
        onClose();
        form.reset();
      })
      .catch(showApiError);
  };

  return (
    <Form {...form}>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        drawerTitle="Decline Reason"
        drawerDescription="Please add your reason for rejection"
        hideDefaultFooterBtn
        data-testid="declinereason-drawerright"
      >
        <div className="flex flex-col flex-grow mb-[74px]">
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="rejection"
              label="Reason for rejection"
              render={({ field }) => (
                <Textarea
                  placeholder="Enter a reason for rejection."
                  className="resize-none"
                  {...field}
                />
              )}
            />

            <DrawerFooter
              onClose={onClose}
              submitButtonType="submit"
              disableSubmitButton={rejectReqProps.isLoading}
            />
          </form>
        </div>
      </DrawerRight>
    </Form>
  );
};

export default DeclineReason;
