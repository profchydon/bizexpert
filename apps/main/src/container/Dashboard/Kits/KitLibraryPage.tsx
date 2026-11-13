"use client";

import { useMemo, useState } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { TableListLocationProvider } from "@/hooks/tableListLocation";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { withListLocation } from "@/utils/tableListPage";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import Pagination from "@/components/Custom/Pagination";
import Loader from "@/components/Loader";
import { useGetKitsQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKits";
import { useArchiveKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/archiveKit";
import { useUnarchiveKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/unarchiveKit";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import routes from "@/routes";
import type { Kit, KitListItem, KitStatus } from "./types";
import { extractKitErrorMessage } from "./utils";
import CreateKitDialog from "./components/CreateKitDialog";
import DuplicateKitDialog from "./components/DuplicateKitDialog";
import KitArchiveDialog from "./components/KitArchiveDialog";
import KitCardView from "./components/KitCardView";
import KitEditDrawer from "./components/KitEditDrawer";
import KitPageHeader from "./components/KitPageHeader";
import KitTableView from "./components/KitTableView";
import type { KitSortKey, KitSortOrder } from "./components/KitTableView";
import KitToolbar from "./components/KitToolbar";
import { defaultKitFilters } from "./components/KitFilterPopover";
import type { KitFilters } from "./components/KitFilterPopover";
import type { KitView, StatusFilter } from "./components/KitToolbar";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const STATUS_TO_API: Record<Exclude<StatusFilter, "All">, KitStatus> = {
  Draft: "draft",
  Active: "active",
  Archived: "archived",
};

const SORT_KEY_TO_API: Record<KitSortKey, string> = {
  name: "name",
  items: "items_count",
  fulfillment: "fulfillment_mode",
  status: "status",
  updated: "updated_at",
};

const KitLibraryPage = () => {
  const router = useRouter();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const [view, setView] = useState<KitView>("card");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [filters, setFilters] = useState<KitFilters>(defaultKitFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | KitListItem | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Kit | KitListItem | null>(
    null,
  );
  const [duplicateKit, setDuplicateKit] = useState<Kit | KitListItem | null>(
    null,
  );
  const { page, setPage } = useTablePageQuery();
  const [sortKey, setSortKey] = useState<KitSortKey>("updated");
  const [sortOrder, setSortOrder] = useState<KitSortOrder>("desc");

  useResetTablePage(
    setPage,
    debouncedSearch,
    statusFilter,
    filters.fulfillmentModes,
    sortKey,
    sortOrder,
  );

  const apiParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter !== "All" ? STATUS_TO_API[statusFilter] : undefined,
      fulfillment_mode:
        filters.fulfillmentModes.length === 1
          ? filters.fulfillmentModes[0]
          : undefined,
      sort_by: SORT_KEY_TO_API[sortKey],
      sort_order: sortOrder,
      per_page: 20,
      page,
    }),
    [
      debouncedSearch,
      filters.fulfillmentModes,
      statusFilter,
      sortKey,
      sortOrder,
      page,
    ],
  );

  const handleSortChange = (key: KitSortKey, order: KitSortOrder) => {
    setSortKey(key);
    setSortOrder(order);
  };

  const { data: kitsResponse, isFetching } = useGetKitsQuery(
    { companyId: companyId ?? "", params: apiParams },
    { skip: !companyId },
  );

  const kits = useMemo<KitListItem[]>(
    () => kitsResponse?.data?.data ?? [],
    [kitsResponse],
  );

  const currentPage = kitsResponse?.data?.current_page ?? 1;
  const lastPage = kitsResponse?.data?.last_page ?? 1;

  const [archiveKit, { isLoading: isArchiving }] = useArchiveKitMutation();
  const [unarchiveKit, { isLoading: isUnarchiving }] =
    useUnarchiveKitMutation();
  const archiveBusy = isArchiving || isUnarchiving;

  const toggleArchive = async (kit: Kit | KitListItem) => {
    if (!companyId) return;
    try {
      if (kit.is_archived) {
        await unarchiveKit({ companyId: companyId, kitId: kit.id }).unwrap();
        displaySuccessMessage("Kit unarchived");
      } else {
        await archiveKit({ companyId: companyId, kitId: kit.id }).unwrap();
        displaySuccessMessage("Kit archived");
      }
      setArchiveTarget(null);
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to update kit status"),
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <KitPageHeader
        title="Kit Library"
        description="Manage reusable device bundles for your procurement rules."
        breadcrumbs={[{ label: "Kit Library" }]}
        onCreateKit={() => setCreateOpen(true)}
      />

      <KitToolbar
        search={search}
        statusFilter={statusFilter}
        filters={filters}
        resultCount={kits.length}
        view={view}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onFiltersChange={setFilters}
        onViewChange={setView}
      />

      {isFetching && kits.length === 0 ? (
        <div className="flex min-h-[260px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <TableListLocationProvider page={page}>
          {view === "card" ? (
            <KitCardView
              kits={kits}
              onEdit={setEditingKit}
              onArchive={setArchiveTarget}
              onDuplicate={setDuplicateKit}
              onCreateKit={() => setCreateOpen(true)}
            />
          ) : (
            <KitTableView
              kits={kits}
              sortKey={sortKey}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onEdit={setEditingKit}
              onArchive={setArchiveTarget}
              onDuplicate={setDuplicateKit}
              onCreateKit={() => setCreateOpen(true)}
            />
          )}
        </TableListLocationProvider>
      )}

      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={setPage}
      />

      <CreateKitDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(kit) => {
          setCreateOpen(false);
          displaySuccessMessage(
            "Kit created",
            "Your new kit has been created.",
          );
          router.push(routes.KIT_DETAIL(kit.id));
        }}
      />
      <KitArchiveDialog
        kit={archiveTarget}
        isLoading={archiveBusy}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={() => archiveTarget && toggleArchive(archiveTarget)}
      />
      <KitEditDrawer kit={editingKit} onClose={() => setEditingKit(null)} />
      <DuplicateKitDialog
        sourceKit={duplicateKit}
        onClose={() => setDuplicateKit(null)}
      />
    </div>
  );
};

export default KitLibraryPage;
