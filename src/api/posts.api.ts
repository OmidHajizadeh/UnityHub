import { Query } from "appwrite";
import { v4 as uuidv4 } from "uuid";

import {
  deleteFile,
  getFilePreview,
  getFileView,
  uploadFile,
} from "@/api/file.api";
import { getCurrentUser } from "@/api/user.api";
import { createAudit, deleteAudit } from "@/api/audits.api";
import { appwriteConfig, databases } from "@/lib/AppWirte/config";
import { UnityHubError, generateAuditId } from "@/lib/utils";
import {
  LikePostParams,
  NewPost,
  Post,
  UnityHubDocumentList,
  UpdatePost,
} from "@/types";

export async function createPost(post: NewPost) {
  const uploadedFile = await uploadFile(post.files[0]);

  // Get file url
  let fileUrl = getFilePreview(uploadedFile.$id);

  if (post.mediaType === "video") {
    fileUrl = getFileView(uploadedFile.$id);
  } else {
    fileUrl = getFilePreview(uploadedFile.$id);
  }

  if (!fileUrl) {
    await deleteFile(uploadedFile.$id);
    throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید");
  }

  // Convert tags into array
  // const rawTags = post.tags?.replace(/ /g, "").split(",");
  const tags = Array.from(new Set(post.tags)) || [];
  const uniqueId = uuidv4();

  // Create post
  const newPost = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    uniqueId,
    {
      creator: post.userId,
      caption: post.caption,
      imageUrl: fileUrl,
      imageId: uploadedFile.$id,
      location: post.location,
      tags,
      mediaType: post.mediaType,
    }
  );

  if (!newPost) {
    await deleteFile(uploadedFile.$id);
    throw new UnityHubError(
      "آپلود پست با خطا مواجه شد",
      "لطفاً دوباره امتحان کنید"
    );
  }

  return newPost as Post;
}

export async function updatePost(post: UpdatePost) {
  const tags = Array.from(new Set(post.tags)) || [];

  // Update post
  const updatedPost = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    post.$id,
    {
      caption: post.caption,
      location: post.location,
      tags,
    }
  );

  if (!updatedPost) {
    throw new UnityHubError(
      "ویرایش پست با خطا مواجه شد",
      "لطفاً دوباره امتحان کنید"
    );
  }

  return updatedPost as Post;
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId)
    throw new UnityHubError("خطای کاربر", "لطفاً دوباره امتحان کنید");

  const deletePostPromise = databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId
  );

  const deleteMediaPromise = deleteFile(imageId);

  const [deletePost, deleteMedia] = await Promise.all([
    deletePostPromise,
    deleteMediaPromise,
  ]);

  if (!deletePost && !deleteMedia)
    throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید.");

  return { status: "ok" };
}

export async function likePost({ action, likesArray, post }: LikePostParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    throw new UnityHubError(
      "شما اجازه لایک کردن این پست را ندارید",
      "لطفا به حساب کاربری خود وارد شوید"
    );

  const updatedPostPromise = databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    post.$id,
    {
      likes: likesArray,
    }
  );

  let auditPromise = undefined;
  const uniqueAuditId = generateAuditId("like", currentUser.$id, post.$id);

  if (post.creator.$id !== currentUser.$id) {
    if (action === "like") {
      auditPromise = createAudit(
        {
          userId: post.creator.$id,
          initiativeUserId: currentUser.$id,
          initiativeUserImageUrl: currentUser.imageUrl,
          initiativeUserUsername: currentUser.username,
          message: "پست شما را لایک کرد.",
          postImageUrl: post.imageUrl,
          postId: post.$id,
          auditType: "like",
        },
        uniqueAuditId
      );
    } else {
      auditPromise = deleteAudit(uniqueAuditId);
    }
  }

  const [updatedPost] = await Promise.all([updatedPostPromise, auditPromise]);

  if (!updatedPost)
    throw new UnityHubError(
      "لایک پست با خطا مواجه شد",
      "لطفاً دوباره امتحان کنید."
    );
  return updatedPost as Post;
}

export async function savePost(postId: string, savesArray: string[]) {
  const updatedPost = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    {
      saves: savesArray,
    }
  );

  if (!updatedPost)
    throw new UnityHubError(
      "ذخیره پست با خطا مواجه شد",
      "لطفاً دوباره امتحان کنید."
    );

  return updatedPost as Post;
}

export async function getPostById(postId: string) {
  const post = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId
  );

  if (!post)
    throw new UnityHubError("پست پیدا نشد", "لطفاً دوباره امتحان کنید.");

  return post as Post;
}

export async function getExplorerPosts({ pageParam }: { pageParam: number }) {
  const queries: string[] = [
    Query.orderDesc("$createdAt"),
    Query.limit(window.innerWidth > 768 ? 6 : 9),
  ];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    queries
  );

  if (!posts)
    throw new UnityHubError(
      "خطا در دریافت پست ها",
      "لطفاً دوباره امتحان کنید."
    );

  return posts as UnityHubDocumentList<Post>;
}

export async function getHomeFeed({ pageParam }: { pageParam: number }) {
  const user = await getCurrentUser();
  if (!user)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربر",
      "لطفا به حساب کاربری خود وارد شوید"
    );

  const usersId = [user.$id, ...user.followings];

  const queries: string[] = [
    Query.orderDesc("$createdAt"),
    Query.limit(6),
    Query.equal("creator", usersId),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    queries
  );

  if (!posts)
    throw new UnityHubError(
      "خطا در دریافت پست ها",
      "لطفاً دوباره امتحان کنید."
    );

  return posts as UnityHubDocumentList<Post>;
}

export async function searchPosts(searchTerm: string) {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.search("caption", searchTerm)]
  );

  if (!posts)
    throw new UnityHubError(
      "خطا در دریافت پست ها",
      "لطفاً دوباره امتحان کنید."
    );

  return posts as UnityHubDocumentList<Post>;
}
