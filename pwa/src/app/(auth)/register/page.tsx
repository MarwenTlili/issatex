import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { RegistrationForm } from "@/components/auth/registration-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles;

  if (roles?.includes("ROLE_ADMIN")) {
    redirect("/admin");
  } else if (roles?.includes("ROLE_CLIENT")) {
    redirect("/client");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-mute">
      <div className="w-full max-w-3xl">
        <RegistrationForm />
      </div>
    </main>
  );
}
