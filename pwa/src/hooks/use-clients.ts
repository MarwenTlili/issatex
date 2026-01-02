import { QUERY_KEYS } from "@/config/cache";
import { clientsApiService } from "@/lib/api/clients-api";
import { ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { Client } from "@/types/resources/Client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useCurrentClient = () => {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_CLIENT, session?.user?.id],
    queryFn: async (): Promise<Client | null> => {
      if (!session?.user?.id) {
        throw new Error("Aucune session trouvé");
      }

      const clientsData = await clientsApiService.getAllByAccountId(
        session.user.id
      );

      if (clientsData.member.length === 0) {
        throw new Error("Aucun client trouvé pour cet utilisateur");
      }

      // Return the first client (should be only one due to OneToOne relationship)
      return clientsData.member[0];
    },
    enabled: status === "authenticated" && !!session?.user?.id,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useClient = (identifier?: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CLIENT, `${identifier}`],
    queryFn: () => clientsApiService.getOne(identifier!),
    enabled: !!identifier,
    onError: (err) => handleApiError(err as ApiError),
  });
};
