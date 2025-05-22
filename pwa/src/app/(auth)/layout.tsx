import type React from "react";

import Providers from "@/app/providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main>{children}</main>
    </Providers>
  );
}
