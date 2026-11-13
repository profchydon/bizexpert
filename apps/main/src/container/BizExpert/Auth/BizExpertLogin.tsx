"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/bizexpert/auth";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";
import routes from "@/routes";
import { BizExpertLoginForm } from "./BizExpertLoginForm";
import { BizExpertLoginPanel } from "./BizExpertLoginPanel";
import {
  bizExpertLoginFormColumnClass,
  bizExpertLoginFormShellClass,
  bizExpertLoginMobileBrandClass,
  bizExpertLoginPageClass,
} from "./bizExpertLoginClasses";

export default function BizExpertLogin() {
  const router = useRouter();
  const { isLoading } = useBizExpertAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated()) {
      router.replace(routes.OVERVIEW);
    }
  }, [isLoading, router]);

  return (
    <div className={bizExpertLoginPageClass}>
      <BizExpertLoginPanel />
      <div className={bizExpertLoginFormColumnClass}>
        <p className={bizExpertLoginMobileBrandClass}>BizExpert</p>
        <div className={bizExpertLoginFormShellClass}>
          <BizExpertLoginForm />
        </div>
      </div>
    </div>
  );
}
