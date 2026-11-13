"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useViewNavigation } from "@/hooks/useViewNavigation";

type NavigateButtonProps = Omit<ButtonProps, "onClick"> & {
  href: string;
  replace?: boolean;
  onBeforeNavigate?: () => void;
  children?: ReactNode;
};

const NavigateButton = ({
  href,
  replace,
  onBeforeNavigate,
  children,
  isLoading,
  ...buttonProps
}: NavigateButtonProps) => {
  const { view, isPending } = useViewNavigation();

  return (
    <Button
      {...buttonProps}
      isLoading={isLoading || isPending}
      onClick={() => {
        onBeforeNavigate?.();
        view(href, { replace });
      }}
      data-testid="navigatebutton-button"
    >
      {children}
    </Button>
  );
};

export default NavigateButton;
