import type React from "react";

import Providers from "@/app/providers";
import { Toaster } from "sonner";

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
