import { Query } from "appwrite";

import { appwriteConfig, databases } from "@/lib/AppWirte/config";
import { UnityHubError, generateAuditId } from "@/lib/utils";
import { getCurrentUser } from "@/api/user.api";
import { createAudit, deleteAudit } from "@/api/audits.api";
import {
  Comment,
  NewComment,
  Post,
  UnityHubDocumentList,
  UpdateComment,
} from "@/types";

export async function getComments(postId: string) {
  const queries: string[] = [
    Query.orderDesc("$createdAt"),
    Query.equal("postId", postId),
  ];

  const comments = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    queries
  );

  if (!comments)
    throw new UnityHubError(
      "خطا در دریافت کامنت ها",
      "لطفاً دوباره امتحان کنید."
    );

  return comments as UnityHubDocumentList<Comment>;
}

export async function createComment(
  comment: NewComment,
  post: Post,
  commentId: string
) {
  const currentUser = await getCurrentUser();
  const uniqueAuditId = generateAuditId("comment", currentUser.$id, commentId);

  let auditPromise;

  if (currentUser.$id !== post.creator.$id) {
    auditPromise = createAudit(
      {
        userId: post.creator.$id,
        initiativeUserId: currentUser.$id,
        initiativeUserImageUrl: currentUser.imageUrl,
        initiativeUserUsername: currentUser.username,
        message: comment.text,
        postImageUrl: post.imageUrl,
        postId: post.$id,
        auditType: "comment",
      },
      uniqueAuditId
    );
  }

  const newCommentPromise = databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    commentId,
    {
      text: comment.text,
      author: comment.author.$id,
      postId: comment.postId,
    }
  );

  const [newComment] = await Promise.all([newCommentPromise, auditPromise]);

  if (!newComment) {
    await deleteAudit(uniqueAuditId);
    throw new UnityHubError("خطا در ارسال کامنت", "لطفاً دوباره امتحان کنید.");
  }

  return newComment as Comment;
}

export async function updateComment(comment: UpdateComment) {
  const { commentId, ...restOfProperties } = comment;
  const updatedComment = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    commentId,
    restOfProperties
  );

  if (!updatedComment)
    throw new UnityHubError("خطا در ویرایش کامنت", "لطفاً دوباره امتحان کنید.");

  return updatedComment as Comment;
}

export async function deleteComment(comment: Comment, postCreatorId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new UnityHubError(
      "شما اجازه حذف این کامنت را ندارید",
      "لطفا به حساب کاربری خود وارد شوید"
    );
  }

  const deleteCommentPromise = databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    comment.$id
  );

  let uniqueAuditId;
  let auditPromise;

  if (comment.author.$id !== postCreatorId) {
    uniqueAuditId = generateAuditId("comment", currentUser.$id, comment.$id);
    auditPromise = deleteAudit(uniqueAuditId);
  }

  const [deletedComment] = await Promise.all([
    deleteCommentPromise,
    auditPromise,
  ]);

  if (!deletedComment)
    throw new UnityHubError("خطا در حذف کامنت", "لطفاً دوباره امتحان کنید.");
  return comment.$id;
}
