import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import {
  createPost,
  deletePost,
  likePost,
  savePost,
  updatePost,
} from "@/api/posts.api";
import { createComment, deleteComment, updateComment } from "@/api/comment.api";
import {
  sendResetPasswordLink,
  createUserAccount,
  followUser,
  resetPassword,
  signInAccount,
  signOutAccount,
  updateUser,
} from "@/api/user.api";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";
import {
  Comment,
  LikePostParams,
  NewComment,
  NewPost,
  NewUser,
  Post,
  ResetPassword,
  UnityHubDocumentList,
  UnityHubPagesList,
  UpdateComment,
  UpdatePost,
  UpdateUser,
} from "@/types";
import { useToast } from "@/components/ui/use-toast";

//todo ==> Auth Related Mutations

export function useCreateUserAccount() {
  return useMutation({
    mutationFn: (user: NewUser) => createUserAccount(user),
  });
}

export function useSignInAccount() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user.email, user.password),
    onSuccess: () => navigate("/"),
  });
}

export function useSignOutAccount() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signOutAccount,
    onSuccess: () => navigate("/sign-in"),
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (email: string) => sendResetPasswordLink(email),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (passwordObj: ResetPassword) => resetPassword(passwordObj),
    onSuccess: () => {
      toast({
        title: "رمز عبور شما با موفقیت تغییر یافت",
      });
      navigate("/sign-in");
    },
  });
}

//todo ==> Post Related Mutations

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

//todo ==> User Related Mutations

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

//todo ==> Comment Related Mutations

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      comment,
      post,
    }: {
      comment: NewComment;
      post: Models.Document;
    }) => {
      const uniqueCommentId = uuidv4();
      return createComment(comment, post, uniqueCommentId);
    },
    onSuccess: (comment) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_COMMENTS, comment.postId],
        (prevData: UnityHubDocumentList<Comment>) => {
          const newData = structuredClone(prevData);
          newData.documents.unshift(comment);
          return newData;
        }
      );
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment: UpdateComment) => updateComment(comment),
    onSuccess: (comment) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_COMMENTS, comment.postId],
        (prevData: UnityHubDocumentList<Comment>) => {
          const newData = structuredClone(prevData);
          const prevCommentIndex = newData.documents.findIndex(
            (com) => com.$id === comment.$id
          );
          newData.documents.splice(prevCommentIndex, 1, comment);
          return newData;
        }
      );
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (deletedCommentId) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_COMMENTS, postId],
        (prevData: UnityHubDocumentList<Comment>) => {
          const newData = structuredClone(prevData);
          newData.documents = newData.documents.filter(
            (comment) => comment.$id !== deletedCommentId
          );
          --newData.total;
          return newData;
        }
      );
    },
  });
}
