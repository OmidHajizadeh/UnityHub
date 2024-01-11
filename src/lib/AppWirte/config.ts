import { Client, Account, Storage, Avatars, Databases } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL as string,

  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID as string,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID as string,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID as string,

  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID as string,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID as string,
  commentCollectionId: import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID as string,
  auditCollectionId: import.meta.env.VITE_APPWRITE_AUDIT_COLLECTION_ID as string,
};

export const client = new Client();
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
