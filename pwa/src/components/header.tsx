import { getServerSession } from "next-auth";
import HeaderComponent from "./header-component";
import { authOptions } from "@/lib/auth/auth-options";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <HeaderComponent
      session={session}
      status={session ? "authenticated" : "unauthenticated"}
    />
  );
}
