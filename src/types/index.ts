import { Models } from "appwrite";

//!  User Types

export type User = {
  name: string;
  email: string;
  username: string;
  imageUrl: string;
  bio: string;
  followings: string[];
  audits: string[];
} & Readonly<Models.Document>;

export type NewUser = {
  password: string;
} & Pick<User, "name" | "email" | "username">;

export type UpdateUser = {
  name: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
  bio: string;
} & Readonly<Pick<Models.Document, "$id">>;

//!  Post Types
export type Post = {
  caption: string;
  tags: string[];
  imageId: string;
  imageUrl: string;
  location: string;
  creator: User;
  likes: User[];
  saves: User[];
  mediaType: "image" | "video";
} & Readonly<Models.Document>;

export type NewPost = {
  userId: string;
  caption: string;
  files: File[];
  location: string;
  tags?: string[];
  mediaType: "image" | "video";
};

export type UpdatePost = {
  caption: string;
  location: string;
  tags?: string[];
} & Readonly<Pick<Models.Document, "$id">>;

//!  Comment Types

export type Comment = {
  text: string;
  author: User;
  postId: string;
  edited: boolean;
} & Readonly<Models.Document>;

export type NewComment = Pick<Comment, "text" | "author" | "postId">;

export type UpdateComment = {
  commentId: string;
} & Readonly<Pick<Models.Document, "text" | "author" | "postId" | "edited">>;

//!  Rest
export type LikePostParams = {
  likesArray: string[];
  action: "like" | "dislike";
  post: Post;
};

export type Audit = {
  userId: string;
  message: string;
  initiativeUserId: string;
  initiativeUserImageUrl: string;
  initiativeUserUsername: string;
  auditType: string;
  postImageUrl?: string;
  postId?: string;
} & Readonly<Partial<Models.Document>>;

export type ResetPassword = {
  userId: string;
  secret: string;
  password: string;
  confirmPassword: string;
};

export type PostValues = {
  tags: string[];
  caption: string;
  location: string;
  files: File[];
};


export type UnityHubDocumentList<T> = {
  total: number;
  documents: T[];
};

export type UnityHubPagesList<T> = {
  pageParams: string[];
  pages: UnityHubDocumentList<T>[];
};

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export enum IDBStores {
  USERS = "users",
  CURRENT_USER = "current-user",
}
