"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import NavigateButton from "@/components/NavigateButton";

type ViewNavigateButtonProps = {
  href: string;
  replace?: boolean;
  onBeforeNavigate?: () => void;
  className?: string;
  children?: ReactNode;
  testId?: string;
};

const ViewNavigateButton = ({
  href,
  replace,
  onBeforeNavigate,
  className,
  children = "View",
  testId = "viewnavigatebutton-button",
}: ViewNavigateButtonProps) => {
  return (
    <NavigateButton
      href={href}
      replace={replace}
      onBeforeNavigate={onBeforeNavigate}
      variant="link"
      size="sm"
      className={cn("h-auto px-0 text-primary-700", className)}
      data-testid={testId}
    >
      {children}
    </NavigateButton>
  );
};

export default ViewNavigateButton;
