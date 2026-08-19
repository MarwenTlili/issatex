"use client";

import { type ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { SessionGuard } from "@/providers/session-guard";
import { handleApiError } from "@/lib/api/handle-api-error";

import { CACHE_CONFIG } from "@/config/cache";

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
        /**
         * queryCache + mutationCache: v5-compliant
         * instead of adding onError to each useQuery Hook
         */
        queryCache: new QueryCache({
          onError: (error) => {},
        }),
        mutationCache: new MutationCache({
          onError: (error) => handleApiError(error),
        }),
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SessionGuard>{children}</SessionGuard>
      </QueryClientProvider>
    </SessionProvider>
  );
}
