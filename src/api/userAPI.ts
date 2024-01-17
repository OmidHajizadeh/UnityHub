import { Query } from "appwrite";
import { v4 as uuidv4 } from "uuid";

import {
  account,
  appwriteConfig,
  avatars,
  databases,
} from "@/lib/AppWirte/config";
import { NewUser, ResetPassword, UpdateUser, User } from "@/types";
import { deleteFile, getFilePreview, uploadFile } from "./fileAPI";
import { UnityHubError, generateAuditId } from "@/lib/utils";
import { createAudit, deleteAudit } from "./auditsAPI";

export async function createUserAccount(user: NewUser) {
  // Getting all users
  const users = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId
  );

  if (!users) throw new UnityHubError("خطای سرور", "لطفا دوباره امتحان کنید.");

  // Checking if username exists
  const usernameExists = users.documents.some((prevUser) => {
    return user.username === prevUser.username;
  });

  if (usernameExists)
    throw new UnityHubError(
      "خطای ثبت نام",
      "نام کاربری وارد شده قبلاً ثبت شده است."
    );

  // checking id email exists
  const emailExists = users.documents.some((prevUser) => {
    return user.email === prevUser.email;
  });

  if (emailExists)
    throw new UnityHubError(
      "خطای ثبت نام",
      "ایمیل وارد شده قبلاً ثبت شده است."
    );

  // Creating a user to Appwrite Auth service
  const uniqueId = uuidv4();
  const newAccount = await account.create(
    uniqueId,
    user.email,
    user.password,
    user.name
  );

  if (!newAccount) {
    await account.deleteIdentity(uniqueId);
    throw new UnityHubError("خطای سرور", "لطفا دوباره امتحان کنید.");
  }

  // Setting intial avatar for user
  const avatarUrl = avatars.getInitials(user.name);

  // Adding user to our database
  const newUserInfo = {
    name: newAccount.name,
    email: newAccount.email,
    username: user.username,
    imageUrl: avatarUrl,
  };

  const newUser = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    uniqueId,
    newUserInfo
  );

  const uniqueAuditId = uuidv4();
  await createAudit(
    {
      userId: newUser.$id,
      message: "حساب کاربری شما با موفقیت ساخته شد.",
      initiativeUserId: newUser.$id,
      initiativeUserImageUrl: newUser.imageUrl,
      initiativeUserUsername: newUser.username,
      postImageUrl: newUser.imageUrl,
      auditType: "createAccount",
    },
    uniqueAuditId
  );

  if (!newUser) {
    await Promise.all([
      account.deleteIdentity(uniqueId),
      databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        uniqueId
      ),
    ]);
    throw new UnityHubError("خطای سرور", "لطفا دوباره امتحان کنید.");
  }

  return newUser;
}

export async function signInAccount(email: string, password: string) {
  const session = await account.createEmailSession(email, password);

  if (!session)
    throw new UnityHubError(
      "خطای ورود به حساب کاربری",
      "لطفاً اطلاعات وارد شده را چک و دوباره امتحان کنید."
    );
  return session;
}

export async function signOutAccount() {
  const session = await account.deleteSession("current");

  if (!session)
    throw new UnityHubError(
      "خطای خروج از حساب کاربری",
      "لطفاً دوباره امتحان کنید."
    );

  return session;
}

export async function sendResetPasswordLink(email: string) {
  const url = import.meta.env.VITE_UNITYHUB_URL + "/reset-password";
  console.log(url);
  const passwordRecoverObject = await account.createRecovery(email, url);
  return passwordRecoverObject;
}

export async function resetPassword(passwordObj: ResetPassword) {
  const recoveredAccount = await account.updateRecovery(
    passwordObj.userId,
    passwordObj.secret,
    passwordObj.password,
    passwordObj.confirmPassword
  );

  if (!recoveredAccount)
    throw new UnityHubError("خطا ثبت تغییرات", "لطفاً دوباره امتحان کنید.");

  return recoveredAccount;
}

export async function getCurrentUser() {
  const currentAccount = await account.get();

  if (!currentAccount)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربر",
      "لطفاً به حساب کاربری خود وارد شوید."
    );

  const currentUser = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("$id", currentAccount.$id)]
  );

  if (!currentUser)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربر",
      "لطفاً به حساب کاربری خود وارد شوید."
    );

  return currentUser.documents[0] as User;
}

export async function getUsers(limit?: number) {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربر",
      "لطفاً دوباره امتحان کنید"
    );

  const queries: string[] = [
    Query.orderDesc("$createdAt"),
    Query.notEqual("$id", currentUser.$id),
  ];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  const users = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    queries
  );

  if (!users)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربران",
      "لطفاً دوباره امتحان کنید"
    );

  return users;
}

export async function getUserById(userId: string) {
  const user = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId
  );

  if (!user)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربر",
      "لطفاً دوباره امتحان کنید"
    );

  return user;
}

export async function updateUser(user: UpdateUser) {
  const hasFileToUpdate = user.file.length > 0;

  let image = {
    imageUrl: user.imageUrl,
    imageId: user.imageId,
  };

  // Upload new file to Appwrite storage if there is any
  if (hasFileToUpdate) {
    const uploadedFile = await uploadFile(user.file[0]);

    // Get new file url for preview in update profile page
    const fileUrl = getFilePreview(uploadedFile.$id, true);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید");
    }

    image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
  }

  //  Update user
  const updatedUser = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    user.$id!,
    {
      name: user.name,
      bio: user.bio,
      imageUrl: image.imageUrl,
      imageId: image.imageId,
    }
  );

  // Failed to update
  if (!updatedUser) {
    // Delete new file that has been recently uploaded
    if (hasFileToUpdate) {
      await deleteFile(image.imageId);
    }
    // If no new file uploaded, throw error
    throw new UnityHubError(
      "خطا در بارگذاری تصویر",
      "لطفاً دوباره امتحان کنید"
    );
  }

  // Safely delete old file after successful update
  if (user.imageId && hasFileToUpdate) {
    await deleteFile(user.imageId);
  }

  return updatedUser;
}

export async function followUser(action: string, targetUserId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.$id === targetUserId)
    throw new UnityHubError("خطا", "شما اجازه این عملیات را ندارید.");

  let auditPromise = undefined;
  const uniqueAuditId = generateAuditId(
    "follow",
    currentUser.$id,
    targetUserId
  );

  let currentUserFollowings = currentUser.followings.slice();

  if (action === "follow") {
    currentUserFollowings.push(targetUserId);
    auditPromise = createAudit(
      {
        userId: targetUserId,
        initiativeUserId: currentUser.$id,
        initiativeUserImageUrl: currentUser.imageUrl,
        initiativeUserUsername: currentUser.username,
        message: `کاربر ${currentUser.name} شما را دنبال کرد.`,
        auditType: "follow",
      },
      uniqueAuditId
    );
  } else {
    currentUserFollowings = currentUserFollowings.filter(
      (id: string) => id !== targetUserId
    );
    auditPromise = deleteAudit(uniqueAuditId);
  }

  const targetUser = await getUserById(targetUserId);
  if (!targetUser)
    throw new UnityHubError(
      "خطا در دریافت اطلاعات کاربر",
      "لطفاً دوباره امتحان کنید"
    );

  let targetUserFollowers = targetUser.followers.slice();
  if (action === "follow") {
    targetUserFollowers.push(currentUser.$id);
  } else {
    targetUserFollowers = targetUserFollowers.filter(
      (id: string) => id !== currentUser.$id
    );
  }

  const updateCurrentUserPromise = databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    currentUser.$id,
    {
      followings: currentUserFollowings,
    }
  );

  const updateTargetUserPromise = databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    targetUser.$id,
    {
      followers: targetUserFollowers,
    }
  );

  const [updateCurrentUser, UpdateTargetUser] = await Promise.all([
    updateCurrentUserPromise,
    updateTargetUserPromise,
  ]);

  if (!updateCurrentUser || !UpdateTargetUser)
    throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید.");

  await auditPromise;
}

export async function searchUser({ searchTerm }: { searchTerm: string }) {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.search("username", searchTerm)]
  );
  if (!posts)
    throw new UnityHubError(
      "خطا در پیدا کردن کاربر",
      "لطفاً دوباره امتحان کنید."
    );

  return posts;
}
