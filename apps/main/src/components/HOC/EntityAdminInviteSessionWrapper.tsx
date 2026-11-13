"use client";

import { useAppDispatch } from "@/store";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";
import { useEffect, useState } from "react";

export default function EntityAdminInviteSessionWrapper({
  children,
}: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    clearClientAuthSession(dispatch);
    setIsReady(true);
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return children;
}
