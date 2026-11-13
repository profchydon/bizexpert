"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import { useGetKitQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKit";
import { useGetKitItemsQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKitItems";
import { useActivateKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/activateKit";
import { useArchiveKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/archiveKit";
import { useUnarchiveKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/unarchiveKit";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import {
  useListReturnHref,
  useTablePageQuery,
} from "@/hooks/useTablePageQuery";
import routes from "@/routes";
import { extractKitErrorMessage } from "./utils";
import DuplicateKitDialog from "./components/DuplicateKitDialog";
import KitDetailActions from "./components/KitDetailActions";
import KitEditDrawer from "./components/KitEditDrawer";
import KitInfoCard from "./components/KitInfoCard";
import KitItemList from "./components/KitItemList";
import KitPageHeader from "./components/KitPageHeader";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const KitDetailPage = () => {
  const kitLibraryHref = useListReturnHref(routes.KITS);
  const params = useParams();
  const kitId = params?.id as string;

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data: kitResponse, isFetching: isFetchingKit } = useGetKitQuery(
    { companyId: companyId ?? "", kitId },
    { skip: !companyId || !kitId },
  );

  const { page: itemsPage, setPage: setItemsPage } =
    useTablePageQuery("items_page");

  const { data: itemsResponse, isFetching: isFetchingItems } =
    useGetKitItemsQuery(
      {
        companyId: companyId ?? "",
        kitId,
        params: {
          sort_by: "sort_order",
          sort_order: "asc",
          per_page: 20,
          page: itemsPage,
        },
      },
      { skip: !companyId || !kitId },
    );

  const [editOpen, setEditOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);

  const [activateKit, { isLoading: isActivating }] = useActivateKitMutation();
  const [archiveKit, { isLoading: isArchiving }] = useArchiveKitMutation();
  const [unarchiveKit, { isLoading: isUnarchiving }] =
    useUnarchiveKitMutation();
  const isMutating = isActivating || isArchiving || isUnarchiving;

  const kit = kitResponse?.data;
  const items = itemsResponse?.data?.data ?? kit?.items ?? [];
  const itemsCurrentPage = itemsResponse?.data?.current_page ?? 1;
  const itemsLastPage = itemsResponse?.data?.last_page ?? 1;

  if (!kit && isFetchingKit) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <p className="text-sm text-gray-600">Kit not found.</p>
      </div>
    );
  }

  const liveKit = { ...kit, items };

  const toggleArchive = async () => {
    if (!companyId || isMutating) return;
    try {
      if (kit.is_archived) {
        await unarchiveKit({ companyId: companyId, kitId: kit.id }).unwrap();
        displaySuccessMessage("Kit unarchived");
      } else {
        await archiveKit({ companyId: companyId, kitId: kit.id }).unwrap();
        displaySuccessMessage("Kit archived");
      }
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to update kit status"),
      );
    }
  };

  const activate = async () => {
    if (!companyId || isMutating) return;
    try {
      await activateKit({ companyId: companyId, kitId: kit.id }).unwrap();
      displaySuccessMessage("Kit activated");
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to activate kit"),
      );
    }
  };

  const showActivate = kit.status === "draft" && items.length > 0;

  return (
    <div className="flex flex-col gap-6 py-8">
      <KitPageHeader
        title={kit.name ?? "Untitled kit"}
        description={kit.description ?? undefined}
        breadcrumbs={[
          { label: "Kit Library", href: kitLibraryHref },
          { label: kit.name ?? "Kit" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {showActivate && (
              <button
                type="button"
                onClick={activate}
                disabled={isActivating}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
              >
                {isActivating ? "Activating..." : "Activate Kit"}
              </button>
            )}
            <KitDetailActions
              kit={liveKit}
              onEdit={() => setEditOpen(true)}
              onDuplicate={() => setDuplicateOpen(true)}
              onArchiveToggle={toggleArchive}
            />
          </div>
        }
      />

      <div className="lg:hidden">
        <KitInfoCard kit={liveKit} />
      </div>

      <div className="flex gap-6">
        <aside className="hidden w-[340px] shrink-0 lg:block">
          <div className="sticky top-[140px]">
            <KitInfoCard kit={liveKit} />
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <KitItemList
            kitId={kit.id}
            items={items}
            isLoading={isFetchingItems && items.length === 0}
            currentPage={itemsCurrentPage}
            lastPage={itemsLastPage}
            onPageChange={setItemsPage}
          />
        </section>
      </div>

      <KitEditDrawer
        kit={editOpen ? liveKit : null}
        onClose={() => setEditOpen(false)}
      />
      <DuplicateKitDialog
        sourceKit={duplicateOpen ? liveKit : null}
        onClose={() => setDuplicateOpen(false)}
      />
    </div>
  );
};

export default KitDetailPage;
