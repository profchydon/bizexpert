import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { notificationSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useSetNotificationGroupMutation } from "@/api/baseQueries/companiesApi/settingsApi/notificationSettingApi/setNotificationGroup";
import { ISetNotifications } from "@/types/notificationSetting";
import { useGetNotificationGroupQuery } from "@/api/baseQueries/companiesApi/settingsApi/notificationSettingApi/getNotificationGroup";
import PageState from "@/components/PageState";
import { NotificationEmailField } from "./NotificationEmailField";

const notifications = [
  {
    name: "Orders",
    desc: "Notify these users when equipment is ordered or order status changes.",
    fieldName: "notification.orders" as const,
  },
  {
    name: "Account Billing",
    desc: "Set recipients for monthly reports and account statements.",
    fieldName: "notification.billing" as const,
  },
  {
    name: "Support Request",
    desc: "Define who should be notified for all support requests.",
    fieldName: "notification.support" as const,
  },
];

const NotificationSettings = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const {
    data: getAddedEmails,
    isLoading: addedEmail_isLoading,
    isError: addedEmail_error,
    refetch,
  } = useGetNotificationGroupQuery(
    {
      companyId: company?.id || "",
    },
    { skip: !company },
  );

  const getEmails = getAddedEmails?.data || [];
  const [setNotificationGroup, { isLoading: isSetNotification }] =
    useSetNotificationGroupMutation();

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      notification: {
        orders: [],
        billing: [],
        support: [],
      },
    },
  });

  const watchedNotifications = form.watch("notification");

  const isAllEmpty = Object.values(watchedNotifications).every(
    (emails) => emails.length === 0,
  );

  useEffect(() => {
    if (getEmails && Object.keys(getEmails).length > 0) {
      form.reset({
        notification: {
          orders: getEmails.orders || [],
          billing: getEmails.billing || [],
          support: getEmails.support || [],
        },
      });
    }
  }, [getEmails, form]);

  const onSubmit = async (data: z.infer<typeof notificationSchema>) => {
    const payload: ISetNotifications = {
      companyId: company?.id!,
      payload: {
        notification: {
          orders: data.notification.orders,
          billing: data.notification.billing,
          support: data.notification.support,
        },
      },
    };
    try {
      const response = await setNotificationGroup(payload).unwrap();
      displaySuccessMessage(
        "Email Added",
        "Great! The email has been added successfully. You're all set!",
      );

      refetch();
    } catch (error) {
      console.error("Failed to set notification group:", error);
    }
  };

  return (
    <PageState isLoading={addedEmail_isLoading} isError={addedEmail_error}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white"
        >
          <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Notification Settings
              </h2>
              <span className="text-sm text-gray-600">
                Manage who receives email notifications for key company events.
              </span>
            </div>

            <Button
              type="submit"
              disabled={isAllEmpty || isSetNotification}
              data-testid="notificationsettings-button"
            >
              Save
            </Button>
          </div>
          {notifications.map((item, index) => {
            const category = item.fieldName.split(".")[1];
            return (
              <div
                key={item.name}
                className={`flex flex-col gap-4 p-6 lg:flex-row lg:gap-8 ${index > 0 ? "border-t border-gray-200" : ""}`}
              >
                <div className="flex w-full shrink-0 flex-col gap-1 lg:w-[280px]">
                  <label className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </label>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <NotificationEmailField
                    control={form.control}
                    name={item.fieldName}
                    title={item.name}
                    existingEmails={getEmails?.[category] || []}
                  />
                </div>
              </div>
            );
          })}
        </form>
      </Form>
    </PageState>
  );
};

export default NotificationSettings;
