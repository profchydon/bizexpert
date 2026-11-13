import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoEmployeeCountryWarningProps {
  countryLabel: string;
  onClear: () => void;
  officeName?: string;
  onSendToOffice?: () => void;
}

const NoEmployeeCountryWarning: React.FC<NoEmployeeCountryWarningProps> = ({
  countryLabel,
  onClear,
  officeName,
  onSendToOffice,
}) => {
  const canSendToOffice = Boolean(officeName && onSendToOffice);

  return (
    <div className="mt-2 flex items-start gap-3 rounded-xl border border-warning-300 bg-warning-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-600" />

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-warning-700">
          No employees in {countryLabel}
        </p>
        <p className="text-sm text-warning-600">
          {canSendToOffice
            ? `Send these items to ${officeName}, add an employee in ${countryLabel}, or send them to storage.`
            : `Add an employee in ${countryLabel} to assign these items, or send them to storage.`}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {canSendToOffice && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onSendToOffice}
              data-testid="noemployeecountrywarning-button"
            >
              Send to {officeName}
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="link"
            className="h-auto self-start p-0"
            onClick={onClear}
            data-testid="noemployeecountrywarning-button-2"
          >
            Clear devices
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoEmployeeCountryWarning;
