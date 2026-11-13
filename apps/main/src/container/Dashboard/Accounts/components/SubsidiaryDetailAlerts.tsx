import { AccountsFloatingAlert } from "./AccountsFloatingAlert";

type Props = {
  entityName: string;
  savedAlert: boolean;
  closedAlert: boolean;
  closeError: string | null;
  editError: string | null;
  onDismissSaved: () => void;
  onDismissClosed: () => void;
  onDismissCloseError: () => void;
  onDismissEditError: () => void;
};

export function SubsidiaryDetailAlerts({
  entityName,
  savedAlert,
  closedAlert,
  closeError,
  editError,
  onDismissSaved,
  onDismissClosed,
  onDismissCloseError,
  onDismissEditError,
}: Props) {
  return (
    <>
      <AccountsFloatingAlert
        show={savedAlert}
        title="Changes saved"
        description={`${entityName} has been updated.`}
        onDismiss={onDismissSaved}
      />
      <AccountsFloatingAlert
        show={closedAlert}
        title="Entity closed"
        description={`${entityName} has stopped billing. It stays in your list as closed.`}
        onDismiss={onDismissClosed}
      />
      <AccountsFloatingAlert
        show={Boolean(closeError)}
        title="Entity not closed"
        description={closeError ?? ""}
        onDismiss={onDismissCloseError}
      />
      <AccountsFloatingAlert
        show={Boolean(editError)}
        title="Entity not updated"
        description={editError ?? ""}
        onDismiss={onDismissEditError}
      />
    </>
  );
}
