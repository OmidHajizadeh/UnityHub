import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import EditIcon from "/icons/edit.svg";
import Spinner from "@/components/loaders/Spinner";
import CommentSkeleton from "@/components/loaders/CommentSkeleton";
import { multiFormatDateString } from "@/lib/utils";
import {
  useGetComments,
  useGetCurrentUser,
} from "@/hooks/tanstack-query/queries";
import { Post } from "@/types";

const DeleteCommentForm = lazy(
  () => import("@/components/forms/DeleteComment.form")
);
const CommentDialog = lazy(() => import("@/components/pop-ups/CommentDialog"));

const CommentsList = ({ post }: { post: Post }) => {
  const {
    data: comments,
    isPending: isLoadingComments,
    isError,
  } = useGetComments(post.$id);

  const { data: user } = useGetCurrentUser();

  if (isLoadingComments)
    return (
      <ul dir="rtl" className="comments-container">
        {Array.from({ length: 4 }).map((_, index) => (
          <React.Fragment key={index}>
            <CommentSkeleton />
          </React.Fragment>
        ))}
      </ul>
    );

  if (!comments || isError || comments.total === 0)
    return (
      <div className="comments-container">
        <p className="text-center py-7">هیچ کامنتی برای این پست نوشته نشده.</p>
      </div>
    );

  return (
    <ul dir="rtl" className="comments-container">
      <AnimatePresence mode="popLayout">
        {comments.documents.map((comment) => {
          return (
            <motion.li
              layout
              exit={{ scale: 0.8, opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
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
                <Link
                  className="self-start"
                  to={`/profile/${comment.author.$id}`}
                >
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
                      <Suspense fallback={<Spinner size={15} />}>
                        <CommentDialog
                          comment={comment}
                          action="update"
                          post={post}
                        >
                          <img
                            aria-label="کامنت"
                            src={EditIcon}
                            aria-roledescription="button"
                            alt="comments"
                            width={15}
                            height={15}
                            className="cursor-pointer"
                          />
                        </CommentDialog>
                      </Suspense>
                      <Suspense fallback={<Spinner size={15} />}>
                        <DeleteCommentForm
                          comment={comment}
                          postCreatorId={post.creator.$id}
                        />
                      </Suspense>
                    </div>
                  )}
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
};

export default CommentsList;
