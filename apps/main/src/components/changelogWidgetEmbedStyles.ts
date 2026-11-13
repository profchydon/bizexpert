import { cn } from "@/lib/utils";

export const CHANGELOG_IFRAME_SRC =
  "https://changelog.rayda.co/widget?limit=10";

export const changelogIframeClassName = (className?: string) =>
  cn(
    "h-[min(620px,calc(100dvh-8rem))] w-full max-w-[400px] rounded-2xl border-0",
    className,
  );
