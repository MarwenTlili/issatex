import { clientApi } from "@/lib/api";
import { Client } from "@/types/resources/Client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useCurrentClient = () => {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: ["current-client", session?.user?.id],
    queryFn: async (): Promise<Client | null> => {
      if (!session?.user?.id) {
        throw new Error("No user session found");
      }

      const clientsData = await clientApi.getByAccountId(session.user.id);

      if (clientsData.member.length === 0) {
        throw new Error("No client found for this user");
      }

      // Return the first client (should be only one due to OneToOne relationship)
      return clientsData.member[0];
    },
    enabled: status === "authenticated" && !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes - client data doesn't change often
  });
};

export const useClientByUri = (uri: string) => {
  const id = uri.split("/").pop();
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => clientApi.getByURI(uri),
    enabled: !!uri,
  });
};
