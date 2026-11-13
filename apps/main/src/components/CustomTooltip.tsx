import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  delay?: number;
  content: ReactNode;
  children: ReactNode;
  className?: string;
  autoShowOnce?: boolean;
  storageKey?: string;
}

const CustomTooltip: FC<Props> = ({
  delay = 200,
  content,
  children,
  className,
  autoShowOnce = false,
  storageKey = "custom_tooltip_shown",
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (autoShowOnce && content) {
      const hasShown = localStorage.getItem(storageKey) === "true";
      if (!hasShown) {
        // Show tooltip
        setOpen(true);
        localStorage.setItem(storageKey, "true");

        const timer = setTimeout(() => setOpen(false), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [autoShowOnce, content, storageKey]);

  // Skip rendering if no content
  if (!content) return <>{children}</>;

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild ref={triggerRef as any}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <div
            className={cn(
              "bg-gray-950 rounded-lg p-3 text-xs flex items-center gap-x-3",
              className,
            )}
          >
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
