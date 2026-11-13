import { Building02 } from "@untitledui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import {
  ReferenceActionTypeBadge,
  ReferenceSignatureBadge,
  ReferenceStatusBadge,
} from "./ReferenceDrawerBadges";
import { SlideoutData } from "./slideoutData";

interface Props {
  data: SlideoutData;
  status?: string;
  avatarImage?: string;
}

const MetaBlock = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 items-start">
    <p className="text-xs font-medium whitespace-nowrap text-[#475467]">
      {label}
    </p>
    {children}
  </div>
);

export default function ReferenceSlideoutHeader({
  data,
  status,
  avatarImage,
}: Readonly<Props>) {
  return (
    <>
      <div className="relative">
        <div
          className="h-24 w-full"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, #fde68a 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #bfdbfe 0%, transparent 60%), linear-gradient(135deg, #fef3c7 0%, #ede9fe 50%, #dbeafe 100%)",
          }}
        />
        {data.isOffice ? (
          <div
            className="absolute -bottom-10 left-6 flex size-20 items-center justify-center rounded-full border-4 border-white bg-[#f2f4f7] shadow-[0px_4px_8px_rgba(16,24,40,0.1)]"
            data-testid="reference-slideout-office-avatar"
          >
            <Building02 className="size-8 text-[#475467]" />
          </div>
        ) : (
          <Avatar className="absolute -bottom-10 left-6 h-20 w-20 border-4 border-white shadow-[0px_4px_8px_rgba(16,24,40,0.1)]">
            <AvatarImage src={avatarImage || ""} />
            <AvatarFallback className="bg-[#f2f4f7] text-2xl font-medium text-[#475467]">
              {getInitials(data.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="mt-14 px-6 py-6">
        <p className="text-2xl font-semibold text-[#101828]">{data.name}</p>
        {data.contactLine && (
          <p className="text-base text-[#475467]">{data.contactLine}</p>
        )}
        <p className="text-base text-[#475467]">{data.email}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-x-6 gap-y-3 border-y border-[#eaecf0] px-6 py-4">
        <MetaBlock label="Total amount">
          <p className="text-sm text-[#475467]">{data.amount}</p>
        </MetaBlock>
        <MetaBlock label="Order status">
          <ReferenceStatusBadge status={status} />
        </MetaBlock>
        {data.isOffboarding && (
          <MetaBlock label="Action type">
            <ReferenceActionTypeBadge type={data.actionType} />
          </MetaBlock>
        )}
        <MetaBlock label="Signature">
          <ReferenceSignatureBadge
            signatureRequested={data.signatureRequested}
          />
        </MetaBlock>
      </div>
    </>
  );
}
