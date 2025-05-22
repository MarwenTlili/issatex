import type React from "react";
import Providers from "@/app/providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {/* Additional admin-specific providers here if needed */}
      <main>{children}</main>
    </Providers>
  );
}
