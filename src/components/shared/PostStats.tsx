import { AppwriteException } from "appwrite";
import { Suspense, lazy, useState } from "react";

import Spinner from "@/components/loaders/Spinner";
import { useToast } from "@/components/ui/use-toast";
import { useGetCurrentUser } from "@/hooks/react-query/queries";
import { useLikePost, useSavePost } from "@/hooks/react-query/mutations";
import { UnityHubError } from "@/lib/utils";
import { Post, User } from "@/types";

const CommentDialog = lazy(() => import("@/components/pop-ups/CommentDialog"));

type PostStatsProps = {
  post: Post;
  showLikeCount?: boolean;
  showComments?: boolean;
};

const PostStats = ({
  post,
  showComments = false,
  showLikeCount = true,
}: PostStatsProps) => {
  const { toast } = useToast();
  const [likes, setLikes] = useState<string[]>(
    post.likes.map((user: User) => user.$id)
  );

  const [saves, setSaves] = useState<string[]>(
    post.saves.map((user: User) => user.$id)
  );
  const { mutateAsync: likePost, isPending: isLikingPost } = useLikePost();
  const { mutateAsync: savePost, isPending: isSavingPost } = useSavePost();
  const { data: user } = useGetCurrentUser();
  if (!user) return;

  async function likeHandler(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    if (!user) return;
    try {
      e.stopPropagation();
      let newLikes = [...likes];
      let action: "like" | "dislike" = "like";

      if (newLikes.includes(user.$id)) {
        action = "dislike";
        newLikes = newLikes.filter((id) => id !== user.$id);
      } else {
        action = "like";
        newLikes.push(user.$id);
      }

      setLikes(newLikes);
      await likePost({
        likesArray: newLikes,
        action,
        post,
      });
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
    if (!user) return;
    try {
      e.stopPropagation();
      let newSaves = [...saves];

      if (newSaves.includes(user.$id)) {
        newSaves = newSaves.filter((id) => id !== user.$id);
      } else {
        newSaves.push(user.$id);
      }

      setSaves(newSaves);
      await savePost({ postId: post.$id, savesArray: newSaves });
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
          <Spinner size={20} />
        ) : (
          <img
            aria-label="دکمه لایک پست"
            src={`/icons/${likes.includes(user.$id) ? "liked" : "like"}.svg`}
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
      <div className="flex gap-4 items-center">
        {showComments && (
          <Suspense fallback={<Spinner size={20} />}>
            <CommentDialog action="create" post={post}>
              <img
                aria-label="دکمه کامنت"
                src="/icons/chat.svg"
                alt="comments"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </CommentDialog>
          </Suspense>
        )}
        <div>
          {isSavingPost ? (
            <Spinner size={20} />
          ) : (
            <img
              src={`/icons/${saves.includes(user.$id) ? "saved" : "save"}.svg`}
              aria-label="دکمه ذخیره پست"
              alt="save"
              width={20}
              height={20}
              onClick={saveHandler}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostStats;
