"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/base/select/select-native";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { bizexpertApi } from "@/lib/bizexpert/api";
import type { BusinessMember, LocationStaff } from "@/types/bizexpert";
import { LOCATION_STAFF_PERMISSIONS } from "./locationStaffPermissions";
import { readLocationApiError } from "./locationApiError";
import { locationsQueryKeys } from "./locationsQueryKeys";

type Props = {
  businessId: string;
  locationId: string;
};

export function LocationStaffPanel({ businessId, locationId }: Props) {
  const qc = useQueryClient();
  const staffKey = locationsQueryKeys.staff(businessId, locationId);

  const { data: members } = useQuery({
    queryKey: locationsQueryKeys.members(businessId),
    queryFn: async () =>
      (await bizexpertApi.get(`/businesses/${businessId}/members`))
        .data as BusinessMember[],
  });

  const { data: staff } = useQuery({
    queryKey: staffKey,
    queryFn: async () =>
      (
        await bizexpertApi.get(
          `/businesses/${businessId}/locations/${locationId}/staff`,
        )
      ).data as LocationStaff[],
  });

  const assignStaff = useMutation({
    mutationFn: async (userId: string) => {
      await bizexpertApi.post(
        `/businesses/${businessId}/locations/${locationId}/staff`,
        {
          userId,
          canSell: true,
          canReceiveStock: true,
          canTransferStock: false,
          canViewAnalytics: false,
        },
      );
    },
    onSuccess: () => {
      toast.success("Staff assigned");
      void qc.invalidateQueries({ queryKey: staffKey });
    },
    onError: (err) => toast.error(readLocationApiError(err, "Failed")),
  });

  const updatePerm = useMutation({
    mutationFn: async ({
      memberId,
      patch,
    }: {
      memberId: string;
      patch: Partial<LocationStaff>;
    }) => {
      await bizexpertApi.put(
        `/businesses/${businessId}/locations/${locationId}/staff/${memberId}`,
        patch,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: staffKey }),
    onError: (err) => toast.error(readLocationApiError(err, "Update failed")),
  });

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          const userId = String(
            new FormData(event.currentTarget).get("userId") ?? "",
          );
          if (userId) assignStaff.mutate(userId);
        }}
      >
        <NativeSelect
          name="userId"
          className="w-full"
          required
          options={[
            { value: "", label: "Add team member", disabled: true },
            ...(members ?? []).map((member) => ({
              value: member.userId,
              label: member.user?.name ?? member.user?.email ?? member.userId,
            })),
          ]}
        />
        <Button
          type="submit"
          variant="outline"
          size="md"
          isLoading={assignStaff.isPending}
        >
          Assign
        </Button>
      </form>
      <ul className="divide-y divide-gray-200 text-sm">
        {staff?.length ? (
          staff.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0"
            >
              <span className="font-medium text-gray-900">
                {row.user?.name ?? row.userId}
              </span>
              <div className="flex flex-wrap gap-4">
                {LOCATION_STAFF_PERMISSIONS.map((permission) => (
                  <Checkbox
                    key={permission.key}
                    size="sm"
                    label={permission.label}
                    isSelected={row[permission.key]}
                    onChange={(selected) =>
                      updatePerm.mutate({
                        memberId: row.id,
                        patch: { [permission.key]: selected },
                      })
                    }
                  />
                ))}
              </div>
            </li>
          ))
        ) : (
          <li className="py-2 text-sm text-gray-500">No staff assigned yet.</li>
        )}
      </ul>
    </div>
  );
}
