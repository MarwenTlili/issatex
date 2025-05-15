import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ClientPage() {
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles;

  // Verify user is authenticated and has CLIENT role
  if (!session?.user || !roles?.includes("ROLE_CLIENT")) {
    redirect("/login");
  }

  return <>Client Page</>;
}
