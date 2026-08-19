import type React from "react";

import { Toaster } from "@/components/ui/sonner";

import Header from "@/components/common/header";
import Providers from "@/app/providers";
import Footer from "@/components/common/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster position="top-right" expand={false} richColors closeButton />
    </Providers>
  );
}
