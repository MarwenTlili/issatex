import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Toaster } from "@/components/ui/sonner";

import Providers from "@/app/providers";

export default function SecretaryLayout({
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
