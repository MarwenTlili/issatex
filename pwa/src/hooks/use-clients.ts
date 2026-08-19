import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";

import { Client } from "@/types/resources/Client";
import { clientsApiService } from "@/lib/api/clients-api";

import { QUERY_KEYS } from "@/config/cache";

export const useCurrentClient = () => {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_CLIENT, session?.user?.id],
    queryFn: async (): Promise<Client | null> => {
      const clientsData = await clientsApiService.getAllByAccountId(
        session!.user.id,
      );

      // Return the first client (should be only one due to OneToOne relationship)
      return clientsData.member[0] ?? null;
    },
    enabled: status === "authenticated" && !!session?.user?.id,
  });
};

export const useClient = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CLIENT, identifier],
    queryFn: () => clientsApiService.getOne(identifier!),
    enabled: !!identifier,
  });
};
