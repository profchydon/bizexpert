import { ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

interface AssignmentHeaderProps {
  onBack: () => void;
}

const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        color="tertiary"
        size="md"
        iconLeading={ArrowLeft}
        onClick={onBack}
        aria-label="Back to marketplace"
        data-testid="assignmentheader-button"
      />
      <div className="flex flex-col">
        <h1 className="text-[20px] font-semibold leading-[30px] text-primary">
          Assign Devices
        </h1>
        <p className="text-sm text-tertiary">
          Choose where each device goes. Send a whole country at once, then
          change any row.
        </p>
      </div>
    </div>
  );
};

export default AssignmentHeader;
