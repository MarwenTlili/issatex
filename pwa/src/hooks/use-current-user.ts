import { useSession } from "next-auth/react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateUserData, User } from "@/types/resources/User";
import { usersApiService } from "@/lib/api/users-api";

import { QUERY_KEYS } from "@/config/cache";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER, session?.user?.id],
    queryFn: async (): Promise<User | null> => {
      return await usersApiService.getOne(session!.user.id);
    },
    enabled: status === "authenticated" && !!session?.user?.id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      return usersApiService.update(session!.user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CURRENT_USER]);
    },
  });
};
