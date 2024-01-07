import { Dispatch, SetStateAction } from "react";

export type ContextType = {
  user: User & { followings: string[] };
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
  followings: string[]
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
  tags?: string;
};

export type UpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  files: File[];
  location?: string;
  tags?: string;
};
