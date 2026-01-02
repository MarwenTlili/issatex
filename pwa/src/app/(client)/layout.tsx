import type React from "react";
import Header from "@/components/header";
import Providers from "@/app/providers";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

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
