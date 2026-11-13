import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import { SlideoutParty } from "./slideoutData";

export default function ReferenceSlideoutRecipient({
  recipient,
}: Readonly<{ recipient: SlideoutParty }>) {
  return (
    <div className="border-b border-[#eaecf0] px-6 py-4">
      <div className="mb-3 flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-[#475467]" />
        <p className="text-sm font-medium text-[#344054]">Transferred to</p>
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-[#eaecf0] bg-[#f9fafb] p-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-white text-sm font-medium text-[#475467]">
            {getInitials(recipient.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#101828]">
            {recipient.name}
          </p>
          <p className="truncate text-sm text-[#475467]">{recipient.email}</p>
          <p className="mt-0.5 truncate text-sm text-[#475467]">
            {recipient.address}
          </p>
        </div>
      </div>
    </div>
  );
}
