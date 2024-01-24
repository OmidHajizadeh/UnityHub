import { useMutation, useQueryClient } from "@tanstack/react-query";

import { followUser, updateUser } from "@/api/user.api";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";
import { UpdateUser } from "@/types";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: UpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
}

export function useFollowUser(targetUserId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: "follow" | "unfollow") =>
      followUser(action, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, targetUserId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_FEED],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEARCH_USER],
      });
    },
  });
}
