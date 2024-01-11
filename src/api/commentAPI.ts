import { appwriteConfig, databases } from "@/lib/AppWirte/config";
import { UnityHubError, generateAuditId } from "@/lib/utils";
import { NewComment, UpdateComment } from "@/types";
import { Models, Query } from "appwrite";
import { createAudit, deleteAudit } from "./auditsAPI";
import { getCurrentUser } from "./userAPI";

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

  return comments;
}

export async function createComment(
  comment: NewComment,
  post: Models.Document,
  commentId: string
) {
  const currentUser = await getCurrentUser();
  const uniqueAuditId = generateAuditId("comment", currentUser.$id, commentId);

  const auditPromise = createAudit(
    {
      userId: post.creator.$id,
      initiativeUserId: currentUser.id,
      initiativeUserImageUrl: currentUser.imageUrl,
      initiativeUserUsername: currentUser.username,
      message: comment.text,
      postImageUrl: post.imageUrl,
      postId: post.$id,
    },
    uniqueAuditId
  );

  const newCommentPromise = databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    commentId,
    {
      text: comment.text,
      author: comment.author,
      postId: comment.postId,
    }
  );

  const [newComment] = await Promise.all([newCommentPromise, auditPromise]);

  return newComment;
}

export async function updateComment(comment: UpdateComment) {
  const updatedComment = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    comment.commentId,
    {
      text: comment.text,
      author: comment.author,
      postId: comment.postId,
    }
  );

  return updatedComment;
}

export async function deleteComment(commentId: string) {
  const currentUser = await getCurrentUser();
  const deleteCommentPromise = databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    commentId
  );
  const uniqueAuditId = generateAuditId("comment", currentUser.$id, commentId);
  const auditPromise = deleteAudit(uniqueAuditId);

  await Promise.all([deleteCommentPromise, auditPromise]);
}
