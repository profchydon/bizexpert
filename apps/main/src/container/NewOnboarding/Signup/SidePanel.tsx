import { Star } from "lucide-react";
import Image from "next/image";
import bg from "@/assets/images/signup/bg.png";
import dashboard from "@/assets/images/signup/dashboard.png";
import noise from "@/assets/images/signup/noise.png";

export function SidePanel() {
  return (
    <div className="relative hidden h-full overflow-hidden lg:block">
      <Image
        src={bg}
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.24]"
        style={{
          backgroundImage: `url('${noise.src}')`,
          backgroundSize: "1024px 1024px",
        }}
      />

      <div className="absolute top-[96px] right-[64px] left-[80px] flex flex-col gap-6">
        <p className="text-[1.875rem] leading-[2.375rem] font-medium text-gray-900">
          Delivery of the Laptops for new employees happened on the same day and
          it was such a relief especially because we didn&apos;t need to do so
          much.
        </p>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <p className="text-lg leading-7 font-semibold text-gray-900">
              — Miracle Aremu
            </p>
            <p className="text-base leading-6 font-medium text-gray-600">
              Customer Operations at Famasi.
            </p>
          </div>
          <div className="flex shrink-0 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-gray-900 text-gray-900" />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-[399px] left-[80px] h-[682px] w-[1024px] rounded-xl border-[6px] border-gray-900">
        <div className="absolute inset-2 rounded-[10px] bg-gray-900 shadow-[0px_32px_64px_-12px_rgba(16,24,40,0.14)]" />
        <Image
          src={dashboard}
          alt="Rayda dashboard preview"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
