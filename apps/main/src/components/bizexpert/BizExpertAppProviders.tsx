"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BizExpertAuthProvider } from "@/store/bizexpert/auth-context";
import { BizExpertBusinessProvider } from "@/store/bizexpert/business-context";

export function BizExpertAppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BizExpertAuthProvider>
        <BizExpertBusinessProvider>{children}</BizExpertBusinessProvider>
      </BizExpertAuthProvider>
    </QueryClientProvider>
  );
}
