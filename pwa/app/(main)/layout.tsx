import type React from "react";
import Header from "@/components/header";
import Providers from "@/components/providers";
import Footer from "@/components/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Header />
      <main>{children}</main>
      <Footer />
    </Providers>
  );
}
