"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/base/input/input";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";
import { readSettingsApiError } from "./settingsApiError";
import { settingsQueryKeys } from "./settingsQueryKeys";
import {
  profileFormDefaults,
  profileFormSchema,
  toProfilePayload,
  toPublicUser,
  valuesFromUser,
  type ProfileFormValues,
} from "./profileSchema";

export function ProfileSettings() {
  const { user, updateUser } = useBizExpertAuth();
  const qc = useQueryClient();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user ? valuesFromUser(user) : profileFormDefaults,
  });

  const { data: profile } = useQuery({
    queryKey: settingsQueryKeys.profile,
    queryFn: async () => {
      const res = await bizexpertApi.get("/auth/profile");
      return toPublicUser(res.data);
    },
  });

  useEffect(() => {
    if (!profile) return;
    updateUser(profile);
    if (!form.formState.isDirty) {
      form.reset(valuesFromUser(profile));
    }
  }, [form, profile, updateUser]);

  const save = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await bizexpertApi.put(
        "/auth/profile",
        toProfilePayload(values),
      );
      return toPublicUser(res.data);
    },
    onSuccess: async (next) => {
      updateUser(next);
      form.reset(valuesFromUser(next));
      await qc.invalidateQueries({ queryKey: settingsQueryKeys.profile });
      toast.success("Profile updated");
    },
    onError: (err) => toast.error(readSettingsApiError(err, "Update failed")),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personal Info</CardTitle>
        <CardDescription>
          This information is used to identify you on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) => save.mutate(values))}
        >
          <Input
            label="Name"
            value={form.watch("name")}
            onChange={(value) =>
              form.setValue("name", value, { shouldValidate: true })
            }
            isInvalid={Boolean(form.formState.errors.name)}
            hint={form.formState.errors.name?.message}
            isRequired
          />
          <Input
            label="Email"
            value={user?.email ?? profile?.email ?? ""}
            isDisabled
          />
          <Input
            label="Phone"
            value={form.watch("phone") ?? ""}
            onChange={(value) => form.setValue("phone", value)}
          />
          <div className="flex justify-end border-t border-gray-200 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={save.isPending}
            >
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
