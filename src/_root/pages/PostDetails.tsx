import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AppwriteException } from "appwrite";

import PostStats from "@/components/shared/PostStats";
import PostDetailsFallback from "@/components/suspense-fallbacks/PostDetailsFallback";
import { Button } from "@/components/ui/button";
import { useGetCurrentUser, useGetPostById } from "@/hooks/react-query/queries";
import { UnityHubError, multiFormatDateString } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/loaders/Spinner";
import { useDeletePost } from "@/hooks/react-query/mutations";
import CommentsList from "@/components/shared/CommentsList";

const Alert = lazy(() => import("@/components/shared/Alert"));

const PostDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: post,
    isPending: isLoadingPost,
    isError: isErrorPost,
    error,
  } = useGetPostById(id || "");
  const { data: user } = useGetCurrentUser();

  const { mutateAsync: deletePost } = useDeletePost();

  if (isLoadingPost) return <PostDetailsFallback />;

  if (isErrorPost) {
    if (error instanceof UnityHubError) {
      toast({
        title: error.title,
        description: error.message,
        variant: "destructive",
      });
    } else if (error instanceof AppwriteException) {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log(error);
      toast({
        title: "پست پیدا نشد",
        description: "لطفاً دوباره امتحان کنید.",
        variant: "destructive",
      });
    }
  }

  if (!post || !user) {
    return <p>پست پیدا نشد</p>;
  }

  async function deletePostHandler(postId: string, imageId: string) {
    try {
      await deletePost({
        postId,
        imageId,
      });

      navigate(-1);
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
          title: "حذف پست با خطا مواجه شد",
          description: "لطفاً دوباره امتحان کنید.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="post_details-container relative">
      <Helmet>
        <title>{post.caption}</title>
        <meta name="description" content={post.caption} />
        <meta name="author" content={post.creator.name} />

        <meta name="og:title" content="شبکه اجتماعی یونیتی هاب" />
        <meta name="og:type" content="post" />
        <meta name="og:image" content={post.imageUrl} />
        <meta name="og:site_name" content="UnityHub" />
        <meta name="og:description" content={post.caption} />
      </Helmet>
      <div className="absolute opacity-20 h-full hidden xl:block inset-0 after:absolute after:bottom-0 after:w-full after:h-40 after:bg-gradient-to-b after:from-transparent after:to-black before:absolute before:top-0 before:w-full before:h-40 before:bg-gradient-to-t before:from-transparent before:to-black before:z-10">
        <div className="absolute h-full hidden xl:block inset-0 after:absolute after:top-0 after:left-0 after:h-full after:w-40 after:bg-gradient-to-l after:from-transparent after:to-black before:absolute before:top-0 before:right-0 before:w-40 before:h-full before:bg-gradient-to-r before:from-transparent before:to-black">
          <img
            src={post.imageUrl}
            alt="background image"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
      <div className="post_details-card relative z-20">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="post_details-img"
        />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link
              to={`/profile/${post.creator.$id}`}
              className="flex items-center gap-3"
            >
              <img
                src={post.creator.imageUrl || "/icons/profile-placeholder.svg"}
                alt={post.creator.name}
                className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
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
            <div className="flex-center">
              {user.$id === post.creator.$id && (
                <>
                  <Link to={`/update-post/${post.$id}`}>
                    <img
                      src="/icons/edit.svg"
                      alt="edit"
                      width={20}
                      height={20}
                    />
                  </Link>
                  <Suspense fallback={<Spinner />}>
                    <Alert
                      title="آیا مطمئن هستید ؟"
                      description="این عملیات برگشت ناپذیر است و تمام اطلاعات مربوط به این پست بصورت کامل حذف خواهد شد."
                      onSubmit={deletePostHandler.bind(
                        null,
                        post.$id,
                        post.imageId
                      )}
                    >
                      <Button
                        variant="ghost"
                        className="ghost_details-delete-btn"
                      >
                        <img
                          src="/icons/delete.svg"
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

          <div className="w-full">
            <PostStats post={post} showComments />
          </div>
        </div>
      </div>
      <CommentsList post={post} />
    </div>
  );
};

export default PostDetails;
