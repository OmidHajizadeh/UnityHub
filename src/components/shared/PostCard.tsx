import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import GlowingCard from "./GlowingCard";

const PostCard = ({ post }: { post: Models.Document }) => {
  const { user } = useUserContext();

  // if (post.creator) return;

  return (
    <GlowingCard className="post-card after:rounded-[23px]">
      <div className="flex flex-between">
        <div className="flex items-center gap-3">
          <Link to={`profile/${post.creator.$id}`}>
            <img
              src={
                post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
              }
              alt={post.creator.name}
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg: small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
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
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          {post.tags[0] !== "" && (
            <ul className="flex gap-3 mt-3">
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
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={post.caption}
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} userId={user.id} />
    </GlowingCard>
  );
};

export default PostCard;
