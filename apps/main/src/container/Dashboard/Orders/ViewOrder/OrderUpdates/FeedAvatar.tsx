import Image from "next/image";
import { laptop02, logomark, verify_double_icon } from "@/assets/icons";

interface FeedAvatarProps {
  initials: string;
  type: "logo" | "order" | "suborder" | "initials" | "image";
  imageUrl?: string;
}

function FeedAvatar({ initials, type, imageUrl }: Readonly<FeedAvatarProps>) {
  if (type === "image" && imageUrl) {
    return (
      <div className="size-10 overflow-hidden rounded-full bg-[#f5f5f5]">
        <Image
          src={imageUrl}
          alt="avatar"
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (type === "order") {
    return (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#eff8ff]">
        <Image src={logomark} alt="order" width={20} height={20} />
      </div>
    );
  }

  if (type === "suborder") {
    return (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#f2f4f7]">
        <Image src={laptop02} alt="suborder" width={20} height={20} />
      </div>
    );
  }

  if (type === "logo") {
    return (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#eff8ff]">
        <Image src={verify_double_icon} alt="system" width={20} height={20} />
      </div>
    );
  }

  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-[#f2f4f7] text-sm font-medium text-[#535862]">
      {initials}
    </div>
  );
}

export { FeedAvatar };
