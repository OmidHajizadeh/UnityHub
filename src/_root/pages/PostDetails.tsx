import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";

import PostStats from "@/components/shared/PostStats";
import PostDetailsFallback from "@/components/suspense-fallbacks/PostDetailsFallback";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/hooks/react-query/queriesAndMutaions";
import { multiFormatDateString } from "@/lib/utils";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { user } = useUserContext();

  if (isPending) return <PostDetailsFallback />;

  function deletePostHandler() {}

  return (
    <div className="post_details-container">
      <div className="post_details-card">
        <Helmet>
          <title>{post?.caption}</title>
          <meta name="description" content={post?.caption} />
          <meta name="author" content={post?.creator.name} />

          <meta name="og:title" content="شبکه اجتماعی سیرکلیفای" />
          <meta name="og:type" content="post" />
          <meta name="og:image" content={post?.imageUrl} />
          <meta name="og:site_name" content="Circlify" />
          <meta name="og:description" content={post?.caption} />
        </Helmet>
        <img src={post?.imageUrl} alt="creator" className="post_details-img" />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link
              to={`profile/${post?.creator.$id}`}
              className="flex items-center gap-3"
            >
              <img
                src={
                  post?.creator.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt={post?.creator.name}
                className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
              />
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {post?.creator.name}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular">
                    {multiFormatDateString(post?.$createdAt)}
                  </p>
                  -
                  <p className="subtle-semibold lg: small-regular">
                    {post?.location}
                  </p>
                </div>
              </div>
            </Link>
            <div className="flex-center">
              {user.id === post?.creator.$id && (
                <>
                  <Link to={`/update-post/${post?.$id}`}>
                    <img
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Button
                    onClick={deletePostHandler}
                    variant="ghost"
                    className="ghost_details-delete-btn"
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Button>
                </>
              )}
            </div>
          </div>

          <hr className="border border-dark-4/80 w-full" />

          <div className="flex flex-1 flex-col w-full small-medium lg:base-regular">
            <p>{post?.caption}</p>
            {post?.tags[0] !== "" && (
              <ul className="flex gap-3 mt-3">
                {post?.tags.map((tag: string) => {
                  return (
                    <li dir="auto" key={tag} className="text-light-3 ">
                      #{tag}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="w-full">
            <PostStats post={post} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
