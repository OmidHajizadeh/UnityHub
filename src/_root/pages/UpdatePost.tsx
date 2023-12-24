import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/loaders/Spinner";
import { useGetPostById } from "@/hooks/react-query/queriesAndMutaions";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const UpdatePost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-1">
      <Helmet>
        <title>ویرایش پست</title>
      </Helmet>
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bol md:h2-bold w-full">ویرایش پست</h2>
        </div>
        <PostForm action='update' post={post} />
      </div>
    </div>
  );
};

export default UpdatePost;
