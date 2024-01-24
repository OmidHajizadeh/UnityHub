import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import Loader from "@/components/loaders/Spinner";
import PostForm from "@/components/forms/Post.form";
import { useGetPostById } from "@/hooks/react-query/queries";

const UpdatePost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  if (isPending) return <Loader size={50} />;

  return (
    <>
      <Helmet>
        <title>ویرایش پست</title>
      </Helmet>
      <div className="flex flex-1">
        <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img src="/icons/add-post.svg" alt="add" width={36} height={36} />
            <h2 className="h3-bol md:h2-bold w-full">ویرایش پست</h2>
          </div>
          <PostForm action="update" post={post} />
        </div>
      </div>
    </>
  );
};

export default UpdatePost;
