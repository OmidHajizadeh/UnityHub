import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutaions";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const [likes, setLikes] = useState<string[]>(
    post?.likes.map((user: Models.Document) => user.$id)
  );
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  function likeHandler(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();
    let newLikes = [...likes];

    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post?.$id || '', likesArray: newLikes });
  }

  function saveHandler(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();
    //!  04:30:00

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      setIsSaved(true);
      savePost({ postId: post?.$id || '', userId });
    }
  }

  return (
    <div className="flex-between z-20 relative">
      <div className="flex gap-2">
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
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSavedPost ? (
          <Loader />
        ) : (
          <img
            src={`/assets/icons/${isSaved ? "saved" : "save"}.svg`}
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
