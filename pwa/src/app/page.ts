import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles;

  if (roles?.includes("ROLE_ADMIN")) {
    redirect("/admin");
  } else if (roles?.includes("ROLE_CLIENT")) {
    redirect("/client");
  } else if (roles?.includes("ROLE_SECRETARY")) {
    redirect("/secretaire");
  } else {
    redirect("/login");
  }
}
