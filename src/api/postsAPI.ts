import { Query } from "appwrite";
import { v4 as uuidv4 } from "uuid";

import { NewPost, UpdatePost } from "@/types";
import { appwriteConfig, databases } from "../lib/AppWirte/config";
import { deleteFile, getFilePreview, uploadFile } from "./fileAPI";
import { getCurrentUser } from "./userAPI";
import { UnityHubError } from "@/lib/utils";

export async function createPost(post: NewPost) {
  // Upload file to Appwrite storage
  const uploadedFile = await uploadFile(post.files[0]);

  // Get file url
  const fileUrl = getFilePreview(uploadedFile.$id);
  if (!fileUrl) {
    await deleteFile(uploadedFile.$id);
    throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید");
  }

  // Convert tags into array
  const rawTags = post.tags?.replace(/ /g, "").split(",");
  const tags = Array.from(new Set(rawTags)) || [];
  const uniqueId = uuidv4();

  // Create post
  const newPost = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    uniqueId,
    {
      postId: uniqueId,
      creator: post.userId,
      caption: post.caption,
      imageUrl: fileUrl,
      imageId: uploadedFile.$id,
      location: post.location,
      tags,
    }
  );

  if (!newPost) {
    await deleteFile(uploadedFile.$id);
    throw new UnityHubError(
      "آپلود پست با خطا مواجه شد",
      "لطفاً دوباره امتحان کنید"
    );
  }

  return newPost;
}

export async function updatePost(post: UpdatePost) {
  const hasFileToUpdate = post.files.length > 0;

  let image = {
    imageUrl: post.imageUrl,
    imageId: post.imageId,
  };

  if (hasFileToUpdate) {
    const uploadedFile = await uploadFile(post.files[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید");
    }
    image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
  }

  // Convert tags into array
  const rawTags = post.tags?.replace(/ /g, "").split(",");
  const tags = Array.from(new Set(rawTags)) || [];

  // Create post
  const updatedPost = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    post.postId,
    {
      caption: post.caption,
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      location: post.location,
      tags,
    }
  );

  if (!updatedPost) {
    await deleteFile(post.imageId);
    throw new UnityHubError(
      "ویرایش پست با خطا مواجه شد",
      "لطفاً دوباره امتحان کنید"
    );
  }

  return updatedPost;
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId)
    throw new UnityHubError("خطای کاربر", "لطفاً دوباره امتحان کنید");

  const deletePost = await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId
  );

  if (!deletePost)
    throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید.");

  return { status: "ok" };
}

export async function likePost(postId: string, likesArray: string[]) {
  const updatedPost = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    {
      likes: likesArray,
    }
  );

  if (!updatedPost)
    throw new UnityHubError(
      "لایک پست با خطا مواجه شد",
      "لطفاً دوباره امتحان کنید."
    );
  return updatedPost;
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

  return updatedPost;
}

export async function getPostById(postId: string) {
  const post = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId
  );

  if (!post)
    throw new UnityHubError("پست پیدا نشد", "لطفاً دوباره امتحان کنید.");

  return post;
}

export async function getExplorerPosts({ pageParam }: { pageParam: number }) {
  const queries: string[] = [Query.orderDesc("$createdAt"), Query.limit(6)];
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

  return posts;
}

export async function getHomeFeed({ pageParam }: { pageParam: number }) {
  const user = await getCurrentUser();
  if (!user)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربر",
      "لطفاً دوباره امتحان کنید."
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

  return posts;
}

export async function searchPosts({ searchTerm }: { searchTerm: string }) {
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

  return posts;
}

// export async function getUserPosts(userId?: string) {
//   if (!userId) return;

//   try {
//     const post = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
//     );

//     if (!post) throw Error;

//     return post;
//   } catch (error) {
//     console.log(error);
//   }
// }
