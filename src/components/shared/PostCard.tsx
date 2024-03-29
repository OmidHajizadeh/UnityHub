import { Link } from "react-router-dom";

import EditIcon from "/icons/edit.svg";
import { Post } from "@/types";
import { useGetCurrentUser } from "@/hooks/tanstack-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import PostStats from "./PostStats";
import GlowingCard from "./GlowingCard";
import UnityHubVideoPlayer from "./UnityHubVideoPlayer";

const PostCard = ({ post }: { post: Post }) => {
  const { data: user } = useGetCurrentUser();

  return (
    <GlowingCard className="post-card after:rounded-[5px] md:after:rounded-[23px]">
      <div className="flex flex-between">
        <Link
          className="flex items-center gap-3"
          to={`profile/${post.creator.$id}`}
        >
          <img
            src={post.creator.imageUrl || "/icons/profile-placeholder.svg"}
            alt={post.creator.name}
            className="rounded-full w-12 lg:h-12"
          />
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </Link>
        {user?.$id === post.creator.$id && (
          <Link to={`/update-post/${post.$id}`}>
            <img src={EditIcon} alt="edit" width={20} height={20} />
          </Link>
        )}
      </div>
      <div className="small-medium lg:base-medium py-5">
        <Link to={`/posts/${post.$id}`}>
          <p dir="auto" className="font-light whitespace-break-spaces">
            {post.caption}
          </p>
        </Link>
        {post.tags[0] !== "" && (
          <ul dir="ltr" className="flex gap-2 mt-3">
            {post.tags.map((tag: string) => {
              return (
                <li dir="auto" key={tag} className="text-light-3 ">
                  #{tag}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="mb-5">
        {post.mediaType === "video" ? (
          <UnityHubVideoPlayer
            className="post-card_media"
            videoUrl={post.imageUrl}
          />
        ) : (
          <Link to={`/posts/${post.$id}`}>
            <img
              src={post.imageUrl || "/icons/profile-placeholder.svg"}
              alt={post.caption}
              width="500"
              height="500"
              className="post-card_media"
            />
          </Link>
        )}
      </div>

      <PostStats post={post} showComments />
    </GlowingCard>
  );
};

export default PostCard;
