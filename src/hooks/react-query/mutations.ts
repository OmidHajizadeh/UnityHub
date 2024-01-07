import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createPost,
  deletePost,
  likePost,
  savePost,
  updatePost,
} from "@/api/postsAPI";
import {
  createUserAccount,
  followUser,
  signInAccount,
  signOutAccount,
  updateUser,
} from "@/api/userAPI";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";
import { NewPost, NewUser, UpdatePost, UpdateUser } from "@/types";

export function useCreateUserAccount() {
  return useMutation({
    mutationFn: (user: NewUser) => createUserAccount(user),
  });
}

export function useSignInAccount() {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user.email, user.password),
  });
}

export function useSignOutAccount() {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: NewPost) => createPost(post),
    onSuccess: () => {
      toast("در حال بروز رسانی پست ها...");
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
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
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

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: UpdatePost) => updatePost(post),
    onSuccess: (data) => {
      toast("در حال بروز رسانی پست شما...");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
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
      toast("در حال بروز رسانی پست ها...");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_FEED],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORER_POSTS],
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: UpdateUser) => updateUser(user),
    onSuccess: (data) => {
      toast("در حال بروز رسانی حساب کاربری...");
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
      toast("در حال بروز رسانی...");
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
        queryKey: [QUERY_KEYS.SEARCH_USER, targetUserId],
      });
    },
  });
}
