import { Button } from "@/components/ui/button";
import type { AssignmentDestination, ContactSource } from "./types";

interface DestinationMetaProps {
  destination: AssignmentDestination;
  contactSource?: ContactSource;
  isOfficeAdmin?: boolean;
  deviceCountry?: string;
  isCrossBorder?: boolean;
  onChangeContact?: () => void;
}

const DestinationMeta: React.FC<DestinationMetaProps> = ({
  destination,
  contactSource,
  isOfficeAdmin,
  deviceCountry,
  isCrossBorder,
  onChangeContact,
}) => {
  if (destination.type === "employee") {
    if (isCrossBorder && deviceCountry) {
      return (
        <p className="text-xs text-warning-700">
          Ships from {deviceCountry} · international fees may apply
        </p>
      );
    }
    return null;
  }

  if (destination.type === "office") {
    const note =
      contactSource === "row"
        ? "Changed"
        : isOfficeAdmin
          ? "Office admin"
          : null;
    return (
      <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
        <span className="truncate">
          Received by {destination.contactEmployeeName || "nobody yet"}
          {destination.contactEmployeeName && note ? ` · ${note}` : ""}
        </span>
        {onChangeContact && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto shrink-0 p-0 text-xs"
            onClick={onChangeContact}
            data-testid="destinationmeta-button"
          >
            Change
          </Button>
        )}
      </div>
    );
  }

  if (destination.type === "storage") {
    return <p className="text-xs text-gray-500">Storage fee applies.</p>;
  }

  return null;
};

export default DestinationMeta;
