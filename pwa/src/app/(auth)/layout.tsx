import type React from "react";

import { Toaster } from "sonner";

import Providers from "@/app/providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main>{children}</main>
      <Toaster position="top-right" expand={false} richColors closeButton />
    </Providers>
  );
}
