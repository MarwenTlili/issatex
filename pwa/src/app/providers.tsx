"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { CACHE_CONFIG } from "@/config/cache";
import { SessionGuard } from "@/providers/session-guard";

// Base providers
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: CACHE_CONFIG.STALE_TIME,
            refetchOnWindowFocus: false,
            refetchOnMount: "always",
            cacheTime: 0,
            retry: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SessionGuard>{children}</SessionGuard>
      </QueryClientProvider>
    </SessionProvider>
  );
}
