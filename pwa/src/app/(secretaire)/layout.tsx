import Header from "@/components/header";
import Providers from "../providers";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

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
