"use client";

import { ChevronRight, HomeLine } from "@untitledui/icons";
import { FloatingAlert } from "@/components/application/alerts/floating-alert";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { storageAppRoutes } from "../storageAppRoutes";
import { ImportSuccess } from "./components/ImportSuccess";
import { ImportWizard } from "./components/ImportWizard";
import { ReceiptReport } from "./components/ReceiptReport";
import { ReceiptVarianceActions } from "./components/ReceiptVarianceActions";
import { useImportPageFlow } from "./useImportPageFlow";

export default function ImportPage() {
  const { view, isViewLoading, isPending } = useScopedViewNavigation();
  const online = useOnlineStatus();
  const {
    alert,
    setAlert,
    receiptImport,
    activeImport,
    resolved,
    notify,
    submit,
    resolve,
    acceptWrongItem,
  } = useImportPageFlow();

  const goStorage = () => view(storageAppRoutes.storage, "storage");
  const goDashboard = () => view(storageAppRoutes.dashboard, "dashboard");
  const goReceipt = (importId: string) =>
    view(`${storageAppRoutes.storageImport}?receipt=${importId}`, "receipt");

  const content = () => {
    if (receiptImport) {
      return (
        <ReceiptReport
          imp={receiptImport}
          onBack={goStorage}
          isBackLoading={isViewLoading("storage")}
          onDownload={() =>
            notify(
              "Report downloaded",
              "Inventory Receipt Report saved as PDF.",
            )
          }
        >
          <ReceiptVarianceActions
            variance={receiptImport.receipt?.variance ?? "none"}
            resolved={resolved}
            onConfirm={() =>
              resolve(
                "completed",
                "Variance confirmed",
                "Thanks — your import is complete.",
              )
            }
            onDispute={() =>
              resolve(
                "action_required",
                "Shortfall disputed",
                "Rayda Ops is investigating the missing devices.",
              )
            }
            onAccept={acceptWrongItem}
            onReturn={() =>
              resolve(
                "completed",
                "Return requested",
                "Rayda Admin has been alerted to return the device.",
              )
            }
          />
        </ReceiptReport>
      );
    }
    if (activeImport) {
      return (
        <ImportSuccess
          deviceCount={activeImport.devices.length}
          country={activeImport.country}
          onBackToStorage={goStorage}
          isBackLoading={isViewLoading("storage")}
          onViewReceipt={() => goReceipt(activeImport.id)}
          isReceiptLoading={isViewLoading("receipt")}
        />
      );
    }
    return (
      <ImportWizard
        onSubmit={submit}
        onCancel={goStorage}
        isCancelLoading={isViewLoading("storage")}
        onRegisterInterest={(countries) =>
          notify(
            "Interest registered",
            `We'll let you know when Open Fleet launches in ${countries.length === 1 ? countries[0] : `${countries.length} countries`}.`,
          )
        }
      />
    );
  };

  return (
    <div className="pb-12 pt-6">
      <nav className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={goDashboard}
          disabled={isPending}
          aria-label="Dashboard"
          className="text-quaternary transition hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <HomeLine className="size-5" />
        </button>
        <ChevronRight className="size-4 text-quaternary" />
        <button
          type="button"
          onClick={goStorage}
          disabled={isPending}
          className="text-sm text-tertiary transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Storage
        </button>
        <ChevronRight className="size-4 text-quaternary" />
        <span className="text-sm font-semibold text-brand-600">Import</span>
      </nav>
      {!online && (
        <div className="mb-6 rounded-lg bg-warning-secondary px-4 py-3 text-sm text-warning-primary">
          You&apos;re offline. We&apos;ll keep your details — reconnect and try
          again.
        </div>
      )}
      {content()}
      <FloatingAlert
        show={Boolean(alert)}
        color="success"
        title={alert?.title ?? ""}
        description={alert?.description}
        onDismiss={() => setAlert(null)}
      />
    </div>
  );
}
