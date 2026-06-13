import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles;

  if (roles?.includes("ROLE_ADMIN")) {
    redirect("/admin");
  } else if (roles?.includes("ROLE_CLIENT")) {
    redirect("/client");
  } else if (roles?.includes("ROLE_SECRETARY")) {
    redirect("/secretaire");
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FBFBFA]">
      <LoginForm />
    </main>
  );
}
