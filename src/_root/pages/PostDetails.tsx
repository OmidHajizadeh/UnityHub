import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Suspense, lazy } from "react";

import PostStats from "@/components/shared/PostStats";
import PostDetailsFallback from "@/components/suspense-fallbacks/PostDetailsFallback";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPostById,
} from "@/hooks/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/loaders/Spinner";
import { useDeletePost } from "@/hooks/react-query/mutations";

const Alert = lazy(() => import("@/components/shared/Alert"));

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: deletePost } = useDeletePost();

  if (isPending) return <PostDetailsFallback />;

  if (!post) {
    return <p>پست پیدا نشد</p>;
  }

  async function deletePostHandler() {
    console.log(post?.$id, post?.imageId);

    const deletedPost = await deletePost({
      postId: post?.$id,
      imageId: post?.imageId,
    });

    if (!deletedPost) {
      return toast({
        variant: "destructive",
        title: "حذف پست با خطا مواجه شد",
        description: "لطفاً دوباره امتحان کنید.",
      });
    }

    navigate(-1);
  }

  return (
    <div className="post_details-container">
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
      <div className="post_details-card">
        <img src={post?.imageUrl} alt="creator" className="post_details-img" />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link
              to={`/profile/${post?.creator.$id}`}
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
                  <Suspense fallback={<Spinner />}>
                    <Alert
                      title="آیا مطمئن هستید ؟"
                      description="این عملیات برگشت ناپذیر است و تمام اطلاعات مربوط به این پست بصورت کامل حذف خواهد شد."
                      onSubmit={deletePostHandler}
                    >
                      <Button
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
                    </Alert>
                  </Suspense>
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
