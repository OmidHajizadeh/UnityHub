import { Models } from "appwrite";
import React, { useState } from "react";
import {
  useLikePost,
  useSavePost,
} from "@/hooks/react-query/queriesAndMutaions";
import { checkIsLiked, checkIsSaved } from "@/lib/utils";
import Loader from "../loaders/Spinner";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
  showLikeCount?: boolean;
};

const PostStats = ({ post, userId, showLikeCount = true }: PostStatsProps) => {
  const [likes, setLikes] = useState<string[]>(
    post?.likes.map((user: Models.Document) => user.$id)
  );

  const [saves, setSaves] = useState<string[]>(
    post?.saves.map((user: Models.Document) => user.$id)
  );

  const { mutate: likePost, isPending: isLikingPost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();

  function likeHandler(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();
    let newLikes = [...likes];

    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  }

  function saveHandler(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();
    let newSaves = [...saves];

    if (newSaves.includes(userId)) {
      newSaves = newSaves.filter((id) => id !== userId);
    } else {
      newSaves.push(userId);
    }

    setSaves(newSaves);
    savePost({ postId: post?.$id || "", savesArray: newSaves });
  }

  return (
    <div className="flex-between gap-3 z-20 relative">
      <div className="flex gap-2">
        {isLikingPost ? (
          <Loader />
        ) : (
          <img
            src={`/assets/icons/${
              checkIsLiked(likes, userId) ? "liked" : "like"
            }.svg`}
            alt="like"
            width={20}
            height={20}
            onClick={likeHandler}
            className="cursor-pointer"
          />
        )}

        {showLikeCount && (
          <p className="small-medium lg:base-medium">{likes.length}</p>
        )}
      </div>
      <div className="flex">
        {isSavingPost ? (
          <Loader />
        ) : (
          <img
            src={`/assets/icons/${
              checkIsSaved(saves, userId) ? "saved" : "save"
            }.svg`}
            alt="save"
            width={20}
            height={20}
            onClick={saveHandler}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
