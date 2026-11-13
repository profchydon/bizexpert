"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useGetKitQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKit";
import { useCreateKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/createKit";
import { useUpdateKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/updateKit";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import routes from "@/routes";
import type { FulfillmentMode } from "./types";
import { extractKitErrorMessage, getKitFulfillmentMode } from "./utils";
import KitDetailsFields from "./components/KitDetailsFields";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  mode?: "new" | "edit";
}

const KitFormPage = ({ mode = "new" }: Props) => {
  const router = useRouter();
  const params = useParams();
  const kitId = params?.id as string | undefined;
  const isEdit = mode === "edit" && Boolean(kitId);

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data: kitResponse, isFetching } = useGetKitQuery(
    { companyId: companyId ?? "", kitId: kitId ?? "" },
    { skip: !isEdit || !companyId || !kitId },
  );
  const existing = kitResponse?.data;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fulfillmentMode, setFulfillmentMode] =
    useState<FulfillmentMode>("split");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!existing) return;
    setName(existing.name ?? "");
    setDescription(existing.description ?? "");
    setFulfillmentMode(getKitFulfillmentMode(existing.fulfillment_mode));
  }, [existing]);

  const [createKit, { isLoading: isCreating }] = useCreateKitMutation();
  const [updateKit, { isLoading: isUpdating }] = useUpdateKitMutation();
  const isSaving = isCreating || isUpdating;

  const cancelHref = isEdit && kitId ? routes.KIT_DETAIL(kitId) : routes.KITS;

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return setNameError("Kit name is required.");
    if (!companyId) return;

    try {
      if (isEdit && existing) {
        await updateKit({
          companyId: companyId,
          kitId: existing.id,
          payload: {
            name: trimmed,
            description: description.trim() || null,
            fulfillment_mode: fulfillmentMode,
          },
        }).unwrap();
        displaySuccessMessage("Kit updated", "Kit details have been saved.");
        return router.push(routes.KIT_DETAIL(existing.id));
      }

      const response = await createKit({
        companyId: companyId,
        payload: {
          name: trimmed,
          description: description.trim() || null,
          fulfillment_mode: fulfillmentMode,
        },
      }).unwrap();
      displaySuccessMessage("Kit created", "Your new kit has been created.");
      router.push(routes.KIT_DETAIL(response.data.id));
    } catch (error) {
      displayErrorMessage(extractKitErrorMessage(error, "Failed to save kit"));
    }
  };

  if (isEdit && isFetching && !existing) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="sticky top-20 z-30 border-y border-gray-200 bg-white py-3 -page-mx page-px">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Breadcrumb" className="min-w-0 text-sm">
            <Link
              href={routes.KITS}
              className="text-gray-600 transition hover:text-gray-900"
            >
              Catalog / Kits
            </Link>
            <span className="px-2 text-gray-400">/</span>
            <span className="font-semibold text-gray-900">
              {isEdit ? "Edit Kit" : "Create Kit"}
            </span>
          </nav>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              data-testid="kitformpage-button"
            >
              <Link href={cancelHref}>Cancel</Link>
            </Button>
            <Button
              size="sm"
              onClick={save}
              disabled={isSaving}
              data-testid="kitformpage-button-2"
            >
              {isSaving ? "Saving..." : "Save Kit"}
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          <KitDetailsFields
            name={name}
            description={description}
            fulfillmentMode={fulfillmentMode}
            nameError={nameError}
            onNameChange={(value) => {
              setName(value);
              setNameError("");
            }}
            onDescriptionChange={setDescription}
            onFulfillmentModeChange={setFulfillmentMode}
          />
        </div>
      </main>
    </div>
  );
};

export default KitFormPage;
