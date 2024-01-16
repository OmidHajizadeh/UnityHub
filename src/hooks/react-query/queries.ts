import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getHomeFeed,
  getPostById,
  getExplorerPosts,
  searchPosts,
} from "@/api/postsAPI";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";
import {
  getCurrentUser,
  getUserById,
  getUsers,
  searchUser,
} from "@/api/userAPI";
import { getComments } from "@/api/commentAPI";
import { getAudits } from "@/api/auditsAPI";

export function useGetHomeFeed() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_HOME_FEED],
    queryFn: getHomeFeed,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      } else {
        const lastId = lastPage?.documents.at(-1).$id;
        return lastId;
      }
    },
    initialPageParam: null,
  });
}

export function useGetExplorerPosts() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
    queryFn: getExplorerPosts,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      } else {
        const lastId = lastPage?.documents.at(-1).$id;
        return lastId;
      }
    },
    initialPageParam: null,
  });
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
}

export function useGetPostById(postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
}

export function useSearchPosts(searchTerm: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts({ searchTerm }),
    enabled: !!searchTerm,
  });
}

export function useSearchUser(searchTerm: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USER, searchTerm],
    queryFn: () => searchUser({ searchTerm }),
    enabled: !!searchTerm,
  });
}

export function useGetUsers(limit?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, limit],
    queryFn: () => getUsers(limit),
  });
}

export function useGetUserById(userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
}

export function useGetComments(postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId],
    queryFn: () => getComments(postId),
  });
}

export function useGetAudits() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_AUDITS],
    queryFn: getAudits,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      } else {
        const lastId = lastPage?.documents.at(-1).$id;
        return lastId;
      }
    },
    initialPageParam: null,
  });
}
