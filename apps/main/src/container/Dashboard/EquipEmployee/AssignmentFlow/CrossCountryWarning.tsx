import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface CrossCountryWarningProps {
  deviceCountry: string;
  employeeCountry: string;
}

const CrossCountryWarning: React.FC<CrossCountryWarningProps> = ({
  deviceCountry,
  employeeCountry,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="mt-1.5 flex items-start gap-2 rounded-lg border border-warning-300 bg-warning-50 px-3 py-2">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-700" />
      <p className="flex-1 text-xs text-warning-700">
        This device ships from <strong>{deviceCountry}</strong> to an employee
        in <strong>{employeeCountry}</strong>. Customs duties and international
        shipping fees may apply.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss cross-country warning"
      >
        <X className="h-4 w-4 text-warning-700" />
      </button>
    </div>
  );
};

export default CrossCountryWarning;
