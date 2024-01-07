import { AppwriteException, Models } from "appwrite";
import { useState } from "react";

import { UnityHubError, checkIsLiked, checkIsSaved } from "@/lib/utils";
import Spinner from "../loaders/Spinner";
import { useLikePost, useSavePost } from "@/hooks/react-query/mutations";
import { useToast } from "../ui/use-toast";

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
  const { toast } = useToast();
  const { mutateAsync: likePost, isPending: isLikingPost } = useLikePost();
  const { mutateAsync: savePost, isPending: isSavingPost } = useSavePost();

  async function likeHandler(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    try {
      e.stopPropagation();
      let newLikes = [...likes];

      if (newLikes.includes(userId)) {
        newLikes = newLikes.filter((id) => id !== userId);
      } else {
        newLikes.push(userId);
      }

      setLikes(newLikes);
      await likePost({ postId: post?.$id || "", likesArray: newLikes });
    } catch (error) {
      if (error instanceof UnityHubError) {
        return toast({
          title: error.title,
          description: error.message,
          variant: "destructive",
        });
      } else if (error instanceof AppwriteException) {
        return toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log(error);
        return toast({
          title: "لایک پست با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  async function saveHandler(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    try {
      e.stopPropagation();
      let newSaves = [...saves];

      if (newSaves.includes(userId)) {
        newSaves = newSaves.filter((id) => id !== userId);
      } else {
        newSaves.push(userId);
      }

      setSaves(newSaves);
      await savePost({ postId: post?.$id || "", savesArray: newSaves });
    } catch (error) {
      if (error instanceof UnityHubError) {
        return toast({
          title: error.title,
          description: error.message,
          variant: "destructive",
        });
      } else if (error instanceof AppwriteException) {
        return toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log(error);
        return toast({
          title: "ذخیره پست با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="flex-between gap-3 z-20 relative">
      <div className="flex gap-2">
        {isLikingPost ? (
          <Spinner />
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
          <Spinner />
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
