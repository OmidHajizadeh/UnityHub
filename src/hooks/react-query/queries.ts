import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getPostById, searchPosts } from "@/api/posts.api";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";
import {
  getCurrentUser,
  getUserById,
  getUsers,
  searchUser,
} from "@/api/user.api";
import { getComments } from "@/api/comment.api";
import { Post, UnityHubDocumentList, User, UnityHubPagesList } from "@/types";

//todo ==> User Related Queries

export function useGetCurrentUser() {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
    refetchOnMount: false,
  });
}

export function useSearchUser(searchTerm: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USER, searchTerm],
    queryFn: () => searchUser(searchTerm),
    enabled: !!searchTerm,
  });
}

export function useGetUsers(limit: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
}

export function useGetUserById(userId: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,

    placeholderData: () => {
      const users = queryClient.getQueryData([
        QUERY_KEYS.GET_USERS,
      ]) as UnityHubDocumentList<User>;
      if (users) {
        return users.documents.find((user) => user.$id === userId);
      }
      return undefined;
    },
  });
}

//todo ==> Post Related Queries

export function useGetPostById(postId: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,

    placeholderData: () => {
      const cachedPosts = (queryClient.getQueryData([
        QUERY_KEYS.GET_HOME_FEED,
      ]) || queryClient.getQueryData([QUERY_KEYS.GET_EXPLORER_POSTS])) as
        | UnityHubPagesList<Post>
        | undefined;

      if (cachedPosts) {
        return cachedPosts.pages
          .flatMap((docList) => docList.documents)
          .find((post) => post.$id === postId);
      }

      return undefined;
    },
  });
}

export function useSearchPosts(searchTerm: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
}

export function useGetComments(postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId],
    queryFn: () => getComments(postId),
  });
}
