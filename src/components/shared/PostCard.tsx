import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import PostStats from "./PostStats";
import GlowingCard from "./GlowingCard";

const PostCard = ({ post }: { post: Models.Document }) => {
  const { user } = useUserContext();

  // if (post.creator) return;

  return (
    <GlowingCard className="post-card after:rounded-[23px]">
      <div className="flex flex-between">
        <Link
          className="flex items-center gap-3"
          to={`profile/${post.creator.$id}`}
        >
          <img
            src={
              post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
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
        {user.id === post.creator.$id && (
          <Link to={`/update-post/${post.$id}`}>
            <img
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>
      <div className="small-medium lg:base-medium py-5">
        <p dir="auto" className="font-light whitespace-break-spaces">
          {post.caption}
        </p>
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
      <Link to={`/posts/${post.$id}`}>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={post.caption}
          width="auto"
          height="auto"
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} user={user} showComments />
    </GlowingCard>
  );
};

export default PostCard;
