import React from "react";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { useGetComments, useGetCurrentUser } from "@/hooks/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import CommentDialog from "./CommentDialog";
import Alert from "./Alert";
import { useDeleteComment } from "@/hooks/react-query/mutations";
import CommentSkeleton from "../loaders/CommentSkeleton";

type CommentsListProps = {
  post: Models.Document;
};

const CommentsList = ({ post }: CommentsListProps) => {
  const {
    data: comments,
    isPending: isLoadingComments,
    isError,
  } = useGetComments(post.$id);

  const { data: user } = useGetCurrentUser();

  const { mutateAsync: deleteComment } = useDeleteComment(post.$id);

  if (isLoadingComments)
    return (
      <ul
        dir="rtl"
        className="w-full max-w-5xl p-3 flex flex-col gap-3 bg-dark-3 rounded-xl"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <React.Fragment key={index}>
            <CommentSkeleton />
          </React.Fragment>
        ))}
      </ul>
    );

  if (!comments || isError || comments.total === 0) return;

  async function deleteCommentHandler(commentId: string) {
    await deleteComment(commentId);
  }

  return (
    <ul
      dir="rtl"
      className="w-full max-w-5xl p-3 flex flex-col gap-3 bg-dark-3 rounded-xl"
    >
      {comments.documents.map((comment) => {
        return (
          <li
            key={comment.$id}
            className="flex w-full items-start gap-3 bg-dark-2 p-3 rounded-lg"
          >
            <Link className="shrink-0" to={`/profile/${comment.author.$id}`}>
              <img
                src={
                  comment.author.imageUrl || "/icons/profile-placeholder.svg"
                }
                alt="profile"
                className="h-14 w-14 rounded-full"
              />
            </Link>
            <div className="flex flex-col gap-1 w-full">
              <Link to={`/profile/${comment.author.$id}`}>
                <small dir="auto" className="text-light-3">
                  @{comment.author.username}
                </small>
              </Link>
              <p dir="auto" className="font-light whitespace-break-spaces">
                {comment.text}
              </p>
              <div className="flex-between">
                <small className="text-light-4 flex items-center">
                  <time>{multiFormatDateString(comment.$createdAt)}</time>
                  {comment.edited && (
                    <span className="italic inline-flex items-center gap-2 ms-2 before:w-1 before:h-1 before:rounded-full before:inline-block before:bg-light-4">
                      ویرایش شده
                    </span>
                  )}
                </small>
                {user?.$id === comment.author.$id && (
                  <div className="flex gap-3">
                    <CommentDialog
                      comment={comment}
                      action="update"
                      post={comment.postId}
                    >
                      <img
                        src="/icons/edit.svg"
                        alt="comments"
                        width={15}
                        height={15}
                        className="cursor-pointer"
                      />
                    </CommentDialog>
                    <Alert
                      title="آیا مطمئن هستید ؟"
                      onSubmit={deleteCommentHandler.bind(null, comment.$id)}
                      description="این عملیات برگشت ناپذیر است و کامنت شما بصورت کامل حذف خواهد شد."
                    >
                      <img
                        src="/icons/delete.svg"
                        alt="delete"
                        width={18}
                        height={18}
                        className="cursor-pointer"
                      />
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CommentsList;
