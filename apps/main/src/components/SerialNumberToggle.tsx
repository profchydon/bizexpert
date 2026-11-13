import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface SerialNumberToggleProps {
  serialNumber: string;
}

const SerialNumberToggle: React.FC<SerialNumberToggleProps> = ({
  serialNumber,
}) => {
  const [isBlurred, setIsBlurred] = useState(true);

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  useEffect(() => {
    if (serialNumber == "N/A") {
      setIsBlurred(false);
    }
  }, [serialNumber]);

  return (
    <div className="flex items-center space-x-2 w-full">
      <p
        className={`inline-block text-gray-600 text-sm break-words overflow-hidden max-w-full ${isBlurred ? "blur-md" : "blur-none"}`}
      >
        {serialNumber}
      </p>
      {serialNumber != "N/A" && (
        <Button
          onClick={toggleBlur}
          variant="ghost"
          className="text-gray-600 text-sm font-semibold"
          data-testid="serialnumbertoggle-button"
        >
          {isBlurred ? "Show" : "Hide"}
        </Button>
      )}
    </div>
  );
};

export default SerialNumberToggle;
