"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useCloseOfficeMutation } from "@/api/baseQueries/companiesApi/officesApi/closeOffice";
import { useActingAdmin } from "../hooks/useAccountsData";
import { officeCloseRedirectPath } from "./utils/officeDetailHref";
import { useOfficeDetail } from "./hooks/useOfficeDetailServer";
import { canManageOffice } from "../utils/adminScope";
import { officeApiErrorMessage } from "./utils/officeApiError";
import { AccountsFloatingAlert } from "../components/AccountsFloatingAlert";
import { trackOfficeUpdated } from "@/lib/officeAnalytics";
import { CloseOfficeModal } from "./components/CloseOfficeModal";
import { OfficeDetailHeader } from "./components/OfficeDetailHeader";
import { accountsDetailPageShellClass } from "../components/accountsDetailHeaderClasses";
import { AddOfficeAssetModal } from "./detail/components/AddOfficeAssetModal";
import { AddOfficeEmployeeModal } from "./detail/components/AddOfficeEmployeeModal";
import { EditOfficeModal } from "./detail/components/EditOfficeModal";
import { OfficeAreasCard } from "./detail/components/OfficeAreasCard";
import { OfficeAssetsCard } from "./detail/components/OfficeAssetsCard";
import { OfficeEmployeesCard } from "./detail/components/OfficeEmployeesCard";
import { OfficeOverviewCard } from "./detail/components/OfficeOverviewCard";
import { OfficeStatsCard } from "./detail/components/OfficeStatsCard";
import { ManageAdminsSlideout } from "./detail/components/ManageAdminsSlideout";
import { RevokeAdminModal } from "./detail/components/RevokeAdminModal";
import { useOfficeAdmins } from "./hooks/useOfficeAdmins";

function OfficeDetailLoading() {
  return (
    <div
      className="flex min-h-[420px] items-center justify-center"
      aria-busy
      data-testid="officedetailpage-loading"
    >
      <Loader />
    </div>
  );
}

export function OfficeDetailPage({
  officeId,
  entityId,
  fromSubsidiary = false,
}: {
  officeId: string;
  entityId?: string;
  fromSubsidiary?: boolean;
}) {
  const acting = useActingAdmin();
  const officesHref = useListReturnHref(`${routes.ACCOUNTS}?tab=offices`);
  const { push, isPending } = useTransitionRouter();
  const { office, areas, snapshot, isLoading } = useOfficeDetail(
    officeId,
    entityId,
  );
  const [closeOffice, closeResult] = useCloseOfficeMutation();
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [addAssetOpen, setAddAssetOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [note, setNote] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setNote(null), 6000);
    return () => clearTimeout(timer);
  }, [note]);

  const notify = (title: string, description: string) =>
    setNote({ title, description });
  const admins = useOfficeAdmins(office, notify);

  if (isLoading) return <OfficeDetailLoading />;

  if (!office) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-gray-900">
          Office not found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          This office may have been removed or is unavailable.
        </p>
        <Button asChild className="mt-4" data-testid="officedetailpage-button">
          <Link href={officesHref}>Back to offices</Link>
        </Button>
      </div>
    );
  }

  const canEdit = office.status !== "closed" && canManageOffice(office, acting);
  const canClose =
    !office.isPrimary &&
    office.status !== "closed" &&
    canManageOffice(office, acting);

  async function handleCloseOffice() {
    if (!office?.subsidiaryId) return;
    try {
      await closeOffice({
        companyId: office.subsidiaryId,
        officeId: office.id,
      }).unwrap();
      trackOfficeUpdated({ action: "closed", office_id: office.id });
      push(officeCloseRedirectPath(entityId, fromSubsidiary));
    } catch (error) {
      notify(
        "Office not closed",
        officeApiErrorMessage(error, `Could not close ${office.name}.`),
      );
    }
  }

  return (
    <>
      <div className={accountsDetailPageShellClass}>
        <OfficeDetailHeader
          office={office}
          canEdit={canEdit}
          canClose={canClose}
          onEdit={() => setEditOpen(true)}
          onClose={() => setCloseOpen(true)}
          onManageAdmins={() => admins.setManageOpen(true)}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <OfficeOverviewCard office={office} />
            <OfficeStatsCard snapshot={snapshot} currency={office.currency} />
            <OfficeAreasCard
              office={office}
              areas={areas}
              canManage={canEdit}
              onNotify={notify}
            />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <OfficeEmployeesCard
              office={office}
              onAdd={() => setAddEmployeeOpen(true)}
              onNotify={notify}
            />
            <OfficeAssetsCard
              office={office}
              areas={areas}
              snapshot={snapshot}
              onAdd={() => setAddAssetOpen(true)}
              onNotify={notify}
            />
          </div>
        </div>
      </div>

      <AddOfficeEmployeeModal
        office={office}
        isOpen={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdded={(summary) =>
          notify("Employees added", `${summary} added to ${office.name}.`)
        }
        onNotify={notify}
      />
      <AddOfficeAssetModal
        office={office}
        areas={areas}
        isOpen={addAssetOpen}
        onClose={() => setAddAssetOpen(false)}
        onAdded={(summary) =>
          notify("Assets added", `${summary} added to ${office.name}.`)
        }
        onNotify={notify}
      />
      <CloseOfficeModal
        office={office}
        isOpen={closeOpen}
        isClosing={closeResult.isLoading || isPending}
        onClose={() => setCloseOpen(false)}
        onConfirm={handleCloseOffice}
      />
      <EditOfficeModal
        office={office}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={(name) => {
          setEditOpen(false);
          notify("Office updated", `${name} was updated.`);
        }}
        onNotify={notify}
      />
      <ManageAdminsSlideout
        office={office}
        admins={
          office.officeAdminRefs ??
          office.officeAdmins.map((name) => ({ name }))
        }
        actingUserId={acting.userId}
        isOpen={admins.manageOpen}
        isInviting={admins.isInviting}
        onClose={() => admins.setManageOpen(false)}
        onAddAdmins={admins.handleAddAdmins}
        onRequestRevoke={admins.setRevokingAdmin}
      />
      <RevokeAdminModal
        name={admins.revokingAdmin?.name ?? null}
        officeName={office.name}
        isOpen={admins.revokingAdmin !== null}
        isConfirming={admins.isRevoking}
        onClose={() => admins.setRevokingAdmin(null)}
        onConfirm={admins.handleRevokeAdmin}
      />
      <AccountsFloatingAlert
        show={Boolean(note)}
        title={note?.title ?? ""}
        description={note?.description}
        onDismiss={() => setNote(null)}
      />
    </>
  );
}
