import { QUERY_KEYS } from "@/config/cache";
import { type ApiError, handleApiError } from "@/lib/api/handle-api-error";
import { usersApiService } from "@/lib/api/users-api";
import type { UpdateUserData, User } from "@/types/resources/User";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER, session?.user?.id],
    queryFn: async (): Promise<User | null> => {
      if (!session?.user?.id) {
        throw new Error("Aucune session trouvé");
      }

      // Fetch user by ID
      const userData = await usersApiService.getOne(session.user.id);

      return userData;
    },
    enabled: status === "authenticated" && !!session?.user?.id,
    onError: (err) => handleApiError(err as ApiError),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      if (!session?.user?.id) {
        throw new Error("Aucune session trouvé");
      }

      return usersApiService.update(session.user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CURRENT_USER]);
    },
    onError: (err) => handleApiError(err as ApiError),
  });
};
