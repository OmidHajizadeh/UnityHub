import { useInfiniteQuery } from "@tanstack/react-query";

import { getAudits } from "@/api/audits.api";
import { getExplorerPosts, getHomeFeed } from "@/api/posts.api";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";

function getNextPageParam(lastPage: any) {
  if (lastPage && lastPage.documents.length === 0) {
    return null;
  } else {
    return lastPage?.documents.at(-1).$id;
  }
}

export function useGetHomeFeed() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_HOME_FEED],
    queryFn: getHomeFeed,
    getNextPageParam,
    initialPageParam: null,
  });
}

export function useGetExplorerPosts() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
    queryFn: getExplorerPosts,
    getNextPageParam,
    initialPageParam: null,
  });
}

export function useGetAudits() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_AUDITS],
    queryFn: getAudits,
    getNextPageParam,
    initialPageParam: null,
  });
}
