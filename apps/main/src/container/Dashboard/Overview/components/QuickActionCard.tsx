"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { cn } from "@/lib/utils";

type QuickActionCardProps = {
  id: string;
  title: string;
  description: string;
  cta: string;
  image: StaticImageData;
  href: string;
  enabled?: boolean;
  onClick?: () => void;
};

const cardClassName =
  "flex items-center gap-3 rounded-lg border border-border-secondary bg-primary p-4 text-left shadow-sm transition hover:border-brand-200";

const QuickActionCard = ({
  id,
  title,
  description,
  cta,
  image,
  href,
  enabled = true,
  onClick,
}: QuickActionCardProps) => {
  const { push, isPending } = useTransitionRouter();

  const content = (
    <>
      <div className="relative flex h-[110px] w-[121px] shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br from-[#bfd6fa] via-[#e3edfc] to-[#f6faff]">
        <Image
          src={image}
          alt={title}
          className="h-full w-auto object-contain"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-between self-stretch">
        <div>
          <p className="text-xs font-semibold text-primary">{title}</p>
          <p className="text-xs text-tertiary">{description}</p>
        </div>
        <p className="text-sm font-semibold text-brand-600">{cta}</p>
      </div>
    </>
  );

  if (!enabled) {
    return (
      <div
        id={id}
        aria-disabled
        className={cn(cardClassName, "cursor-not-allowed opacity-50")}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      id={id}
      type="button"
      disabled={isPending}
      className={cn(cardClassName, isPending && "opacity-70")}
      onClick={() => (onClick ? onClick() : push(href))}
      data-testid={`${id}-button`}
    >
      {content}
    </button>
  );
};

export default QuickActionCard;
