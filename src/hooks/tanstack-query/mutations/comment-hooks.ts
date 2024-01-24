import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Comment,
  NewComment,
  Post,
  UnityHubDocumentList,
  UpdateComment,
} from "@/types";
import { createComment, deleteComment, updateComment } from "@/api/comment.api";
import { QUERY_KEYS } from "@/lib/react-query/QueryKeys";

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ comment, post }: { comment: NewComment; post: Post }) => {
      const uniqueCommentId = uuidv4();
      return createComment(comment, post, uniqueCommentId);
    },
    onSuccess: (comment) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_COMMENTS, comment.postId],
        (prevData: UnityHubDocumentList<Comment>) => {
          const newData = structuredClone(prevData);
          newData.documents.unshift(comment);
          newData.total++;
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
    mutationFn: ({
      comment,
      postCreatorId,
    }: {
      comment: Comment;
      postCreatorId: string;
    }) => deleteComment(comment, postCreatorId),
    onSuccess: (deletedCommentId) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_COMMENTS, postId],
        (prevData: UnityHubDocumentList<Comment>) => {
          const newData = structuredClone(prevData);
          newData.documents = newData.documents.filter(
            (comment) => comment.$id !== deletedCommentId
          );
          newData.total--;
          return newData;
        }
      );
    },
  });
}
