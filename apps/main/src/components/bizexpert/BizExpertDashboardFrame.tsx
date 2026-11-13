"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AiChatWidget } from "./AiChatWidget";
import { BizExpertSidebar } from "./BizExpertSidebar";
import {
  bizExpertContentClass,
  bizExpertMobileMenuClass,
} from "./bizExpertSidebarClasses";

export function BizExpertDashboardFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        className={`flex size-10 items-center justify-center ${bizExpertMobileMenuClass}`}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>
      <BizExpertSidebar open={open} onClose={() => setOpen(false)} />
      <div className={bizExpertContentClass}>{children}</div>
      <AiChatWidget />
    </>
  );
}
