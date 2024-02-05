import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPost,
  deletePost,
  likePost,
  savePost,
  updatePost,
} from "@/api/posts.api";
import {
  LikePostParams,
  NewPost,
  Post,
  UnityHubPagesList,
  UpdatePost,
} from "@/types";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: NewPost) => createPost(post),
    onSuccess: (createdPost) => {
      const cahcedPosts = queryClient.getQueryData([
        QUERY_KEYS.GET_HOME_FEED,
      ]) as UnityHubPagesList<Post> | undefined;

      if (cahcedPosts) {
        queryClient.setQueryData([QUERY_KEYS.GET_HOME_FEED], () => {
          cahcedPosts.pages[0].documents.unshift(createdPost);
          return cahcedPosts;
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_HOME_FEED],
        });
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
      });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: UpdatePost) => updatePost(post),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, updatedPost.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_FEED],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_FEED],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
      });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (likePostObj: LikePostParams) => likePost(likePostObj),
    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, post.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_FEED],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      savesArray,
    }: {
      postId: string;
      savesArray: string[];
    }) => savePost(postId, savesArray),
    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, post.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_FEED],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
}
