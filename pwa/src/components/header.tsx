import { getServerSession } from "next-auth";
import HeaderComponent from "./header-component";

export default async function Header() {
  const session = await getServerSession();

  return (
    <HeaderComponent
      session={session}
      status={session ? "authenticated" : "unauthenticated"}
    />
  );
}
