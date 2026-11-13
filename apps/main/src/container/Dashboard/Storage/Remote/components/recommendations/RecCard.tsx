import { XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { cx } from "@/utils/cx";
import type { RequestKind, StoredDevice } from "../../types/storage";
import type { Recommendation } from "../../utils/recommendations";

interface Props {
  rec: Recommendation;
  readOnly?: boolean;
  className?: string;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
  onView: (device: StoredDevice) => void;
  onDismiss: (id: string) => void;
}

export function RecCard({
  rec,
  readOnly,
  className,
  onAction,
  onView,
  onDismiss,
}: Props) {
  return (
    <div
      className={cx(
        "relative flex flex-col gap-3 rounded-xl border border-secondary bg-primary p-4",
        className,
      )}
    >
      <ButtonUtility
        size="xs"
        color="tertiary"
        icon={XClose}
        tooltip="Dismiss"
        onClick={() => onDismiss(rec.id)}
        className="absolute top-3 right-3"
      />
      <div className="pr-7">
        <p className="text-sm font-semibold text-primary">{rec.title}</p>
        <p className="mt-1 text-sm text-tertiary">{rec.body}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {rec.actions.map((a) => (
          <Button
            key={a.kind + a.label}
            size="sm"
            color={
              a.kind === "disposal" ? "secondary-destructive" : "secondary"
            }
            isDisabled={readOnly}
            onClick={() => onAction(a.kind, rec.device)}
            data-testid="reccard-button"
          >
            {a.label}
          </Button>
        ))}
        <Button
          size="sm"
          color="link-gray"
          onClick={() => onView(rec.device)}
          data-testid="reccard-button-2"
        >
          View details
        </Button>
      </div>
    </div>
  );
}
