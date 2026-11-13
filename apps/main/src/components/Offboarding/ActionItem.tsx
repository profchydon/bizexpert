import { Check } from "lucide-react";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";

interface ActionItemProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  disabledReason?: string | null;
  onClick?: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({
  label,
  Icon,
  disabled,
  disabledReason,
  onClick,
}) => {
  const item = (
    <div
      className={`group flex cursor-pointer items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={!disabled ? onClick : undefined}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      <Check className="invisible h-5 w-5 text-primary-600 group-hover:visible" />
    </div>
  );

  return (
    <DisabledWithTooltip
      isDisabled={Boolean(disabled)}
      reason={disabledReason}
      triggerClassName="block w-full"
    >
      {item}
    </DisabledWithTooltip>
  );
};
export default ActionItem;
