"use client";

import type { EntityAdminRow } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityPersonLabel";
import type { PreFlightCheck, Subsidiary } from "../types";
import { CloseSubsidiaryModal } from "./CloseSubsidiaryModal";
import {
  EditSubsidiaryModal,
  type EntityEditFormValues,
} from "./EditSubsidiaryModal";
import { ManageAdminsDrawer } from "./ManageAdminsDrawer";
import { ReplaceCardModal } from "./ReplaceCardModal";
import { StatusActionModal } from "./StatusActionModal";
import { SubsidiaryDetailAlerts } from "./SubsidiaryDetailAlerts";
import type { BannerAction } from "./SubsidiaryStatusBanner";

interface Props {
  subsidiary: Subsidiary;
  adminRows: EntityAdminRow[];
  closeChecks: PreFlightCheck[];
  paymentProcessor: string | null;
  replaceCardOpen: boolean;
  editOpen: boolean;
  closeOpen: boolean;
  manageAdminsOpen: boolean;
  bannerAction: BannerAction | null;
  isSaving: boolean;
  isClosing: boolean;
  isReplacingCard: boolean;
  savedAlert: boolean;
  closedAlert: boolean;
  closeError: string | null;
  editError: string | null;
  onCloseEdit: () => void;
  onCloseEntityModal: () => void;
  onCloseManageAdmins: () => void;
  onCloseBanner: () => void;
  onCloseReplaceCard: () => void;
  onReplaceCard: () => void;
  onSave: (values: EntityEditFormValues) => void;
  onConfirmClose: () => void;
  onResolveBanner: (resolved: BannerAction) => void;
  onDismissSaved: () => void;
  onDismissClosed: () => void;
  onDismissCloseError: () => void;
  onDismissEditError: () => void;
}

export function SubsidiaryDetailModals({
  subsidiary,
  adminRows,
  closeChecks,
  paymentProcessor,
  replaceCardOpen,
  editOpen,
  closeOpen,
  manageAdminsOpen,
  bannerAction,
  isSaving,
  isClosing,
  isReplacingCard,
  savedAlert,
  closedAlert,
  closeError,
  editError,
  onCloseEdit,
  onCloseEntityModal,
  onCloseManageAdmins,
  onCloseBanner,
  onCloseReplaceCard,
  onReplaceCard,
  onSave,
  onConfirmClose,
  onResolveBanner,
  onDismissSaved,
  onDismissClosed,
  onDismissCloseError,
  onDismissEditError,
}: Props) {
  return (
    <>
      <EditSubsidiaryModal
        subsidiary={subsidiary}
        isOpen={editOpen}
        isSaving={isSaving}
        isReplacingCard={isReplacingCard}
        onClose={onCloseEdit}
        onReplaceCard={onReplaceCard}
        onSave={onSave}
      />
      <CloseSubsidiaryModal
        subsidiary={subsidiary}
        isOpen={closeOpen}
        isClosing={isClosing}
        onClose={onCloseEntityModal}
        closeChecks={closeChecks}
        onConfirm={onConfirmClose}
      />
      <ReplaceCardModal
        subsidiary={subsidiary}
        processor={paymentProcessor}
        isOpen={replaceCardOpen}
        isConfirming={isReplacingCard}
        onClose={onCloseReplaceCard}
        onConfirm={onReplaceCard}
      />
      <ManageAdminsDrawer
        entityId={subsidiary.id}
        entityName={subsidiary.name}
        admins={adminRows}
        isPrimary={Boolean(subsidiary.isPrimary)}
        isOpen={manageAdminsOpen}
        onClose={onCloseManageAdmins}
      />
      <StatusActionModal
        action={bannerAction}
        subsidiary={subsidiary}
        onClose={onCloseBanner}
        onResolve={onResolveBanner}
        isConfirmLoading={isReplacingCard}
      />
      <SubsidiaryDetailAlerts
        entityName={subsidiary.name}
        savedAlert={savedAlert}
        closedAlert={closedAlert}
        closeError={closeError}
        editError={editError}
        onDismissSaved={onDismissSaved}
        onDismissClosed={onDismissClosed}
        onDismissCloseError={onDismissCloseError}
        onDismissEditError={onDismissEditError}
      />
    </>
  );
}
