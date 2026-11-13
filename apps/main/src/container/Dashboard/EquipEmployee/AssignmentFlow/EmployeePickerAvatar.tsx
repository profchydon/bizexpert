import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  initials: string;
  email?: string;
  className?: string;
}

const EmployeePickerAvatar = ({ initials, email, className }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className={className || "h-5 w-5"}>
            <AvatarFallback className="bg-gray-100 text-[10px] font-medium text-gray-600">
              {initials}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="top">{email || "No email"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmployeePickerAvatar;
