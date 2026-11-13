"use client";

import { useMemo, useState } from "react";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useAccountsPlanTier, useActingAdmin } from "../hooks/useAccountsData";
import { useOverviewPendingAdminInvitation } from "../hooks/useOverviewPendingAdminInvitation";
import { useSubsidiaryDetailCard } from "../hooks/useSubsidiaryDetailCard";
import { useSubsidiaryDetailClose } from "../hooks/useSubsidiaryDetailClose";
import { useSubsidiaryDetailEdit } from "../hooks/useSubsidiaryDetailEdit";
import type { EntityDetailViewModel } from "../utils/buildEntityDetailViewModel";
import type { Subsidiary } from "../types";
import { canManageEntity } from "../utils/adminScope";
import { isPrimaryEntity } from "../utils/isPrimaryEntity";
import { SubsidiaryDetailModals } from "./SubsidiaryDetailModals";
import { SubsidiaryBillingCard } from "./SubsidiaryBillingCard";
import { SubsidiaryCostCentreCard } from "./SubsidiaryCostCentreCard";
import { SubsidiaryDetailHeader } from "./SubsidiaryDetailHeader";
import { SubsidiaryFootprintCard } from "./SubsidiaryFootprintCard";
import { SubsidiaryOfficesCard } from "./SubsidiaryOfficesCard";
import { SubsidiaryOverviewCard } from "./SubsidiaryOverviewCard";
import { SubsidiaryStatusBanner } from "./SubsidiaryStatusBanner";
import { accountsDetailPageShellClass } from "./accountsDetailHeaderClasses";

export function SubsidiaryDetailView({
  detail,
}: {
  detail: EntityDetailViewModel;
}) {
  const acting = useActingAdmin();
  const planTier = useAccountsPlanTier();
  const { getCompanyDetails } = useAuthUserDetail();
  const companyId = getCompanyDetails()?.id;
  const {
    closeOpen,
    setCloseOpen,
    closedAlert,
    setClosedAlert,
    closeError,
    setCloseError,
    isClosing,
    handleCloseEntity,
  } = useSubsidiaryDetailClose(detail.subsidiary.id, detail.subsidiary.name);
  const {
    submitEdit,
    isSaving,
    savedAlert,
    setSavedAlert,
    editError,
    setEditError,
  } = useSubsidiaryDetailEdit(detail.subsidiary.id, detail.subsidiary.name);
  const [editOpen, setEditOpen] = useState(false);
  const [manageAdminsOpen, setManageAdminsOpen] = useState(false);
  const [override, setOverride] = useState<Partial<Subsidiary> | null>(null);

  const subsidiary = useMemo(
    () =>
      override ? { ...detail.subsidiary, ...override } : detail.subsidiary,
    [detail.subsidiary, override],
  );

  const primaryEntity = isPrimaryEntity(subsidiary, companyId);

  const canClose =
    canManageEntity(subsidiary, acting) &&
    !primaryEntity &&
    subsidiary.status !== "closed";

  const canEdit =
    canManageEntity(subsidiary, acting) && subsidiary.status !== "closed";

  const showCostCentre =
    canManageEntity(subsidiary, acting) && detail.costCentreSpend.length > 0;
  const card = useSubsidiaryDetailCard(subsidiary, setOverride);
  const pendingInvitation = useOverviewPendingAdminInvitation(
    subsidiary.id,
    subsidiary.admins.length,
  );

  return (
    <>
      <div className={accountsDetailPageShellClass}>
        <SubsidiaryDetailHeader
          subsidiary={subsidiary}
          companyId={companyId}
          canEdit={canEdit}
          canClose={canClose}
          isReplacingCard={card.isCapturing}
          onEdit={() => setEditOpen(true)}
          onClose={() => setCloseOpen(true)}
          onReplaceCard={() => card.setReplaceCardOpen(true)}
          onManageAdmins={() => setManageAdminsOpen(true)}
        />
        <SubsidiaryStatusBanner
          subsidiary={subsidiary}
          onCta={card.setBannerAction}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <SubsidiaryOverviewCard
              subsidiary={subsidiary}
              planTier={planTier}
              pendingInvitation={pendingInvitation}
            />
            <SubsidiaryBillingCard
              subsidiary={subsidiary}
              actingRole={acting.role}
            />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <SubsidiaryOfficesCard
              subsidiary={subsidiary}
              planTier={planTier}
              offices={detail.offices}
            />
            <SubsidiaryFootprintCard
              subsidiary={subsidiary}
              footprint={detail.footprint}
            />
            {showCostCentre && (
              <SubsidiaryCostCentreCard
                subsidiary={subsidiary}
                spendRows={detail.costCentreSpend}
                totalThisMonth={detail.costCentreTotal}
              />
            )}
          </div>
        </div>
      </div>

      <SubsidiaryDetailModals
        subsidiary={subsidiary}
        adminRows={detail.adminRows}
        closeChecks={detail.closeChecks}
        paymentProcessor={detail.paymentProcessor}
        replaceCardOpen={card.replaceCardOpen}
        editOpen={editOpen}
        closeOpen={closeOpen}
        manageAdminsOpen={manageAdminsOpen}
        bannerAction={card.bannerAction}
        isSaving={isSaving}
        isClosing={isClosing}
        isReplacingCard={card.isCapturing}
        savedAlert={savedAlert}
        closedAlert={closedAlert}
        closeError={closeError}
        editError={editError}
        onCloseEdit={() => setEditOpen(false)}
        onCloseEntityModal={() => setCloseOpen(false)}
        onCloseManageAdmins={() => setManageAdminsOpen(false)}
        onCloseBanner={() => card.setBannerAction(null)}
        onCloseReplaceCard={() => card.setReplaceCardOpen(false)}
        onReplaceCard={card.handleReplaceCard}
        onSave={(values) =>
          submitEdit({ ...values, isPrimary: primaryEntity }, () =>
            setEditOpen(false),
          )
        }
        onConfirmClose={() =>
          handleCloseEntity(() => setOverride({ status: "closed" }))
        }
        onResolveBanner={card.handleBannerResolve}
        onDismissSaved={() => setSavedAlert(false)}
        onDismissClosed={() => setClosedAlert(false)}
        onDismissCloseError={() => setCloseError(null)}
        onDismissEditError={() => setEditError(null)}
      />
    </>
  );
}
