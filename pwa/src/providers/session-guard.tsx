"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      queryClient.clear(); // Invalidate all TansStack queries
      signOut({ callbackUrl: "/login" });
    }
  }, [session, queryClient]);

  return <>{children}</>;
}
