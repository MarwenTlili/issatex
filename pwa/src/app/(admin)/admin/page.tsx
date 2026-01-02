import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AdminClientWrapper from "@/components/admin/admin-client-wrapper";
import { authOptions } from "@/lib/auth/auth-options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles;

  // Verify user is authenticated and has ADMIN role
  if (!session?.user || !roles?.includes("ROLE_ADMIN")) {
    redirect("/login");
  }

  return <AdminClientWrapper />;
}
