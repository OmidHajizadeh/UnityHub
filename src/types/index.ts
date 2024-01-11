import { Models } from "appwrite";
import { Dispatch, SetStateAction } from "react";

export type ContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: Dispatch<SetStateAction<User>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type UpdateUser = {
  userId: string;
  name: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
  bio: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  imageUrl: string;
  bio: string;
  followings: string[];
  audits: string[];
};

export type NewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type NewPost = {
  userId: string;
  caption: string;
  files: File[];
  location?: string;
  tags?: string[];
};

export type UpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  files: File[];
  location?: string;
  tags?: string[];
};

export type NewComment = {
  text: string;
  author: string;
  postId: string;
};

export type UpdateComment = {
  commentId: string;
  text: string;
  author: string;
  postId: string;
};

export type Audit = {
  userId: string;
  message: string;
  initiativeUserId: string;
  initiativeUserImageUrl: string;
  initiativeUserUsername: string;
  postImageUrl?: string;
  postId?: string;
};

export type LikePostParams = {
  likesArray: string[];
  action: "like" | "dislike";
  post: Models.Document;
};
