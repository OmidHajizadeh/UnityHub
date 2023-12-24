import PostForm from "@/components/forms/PostForm";
import { Helmet } from "react-helmet";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <Helmet>
        <title>افزودن پست جدید</title>
      </Helmet>
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
            className="invert-white"
          />
          <h2 className="h3-bol md:h2-bold w-full">ایجاد پست جدید</h2>
        </div>
        <PostForm action="create" />
      </div>
    </div>
  );
};

export default CreatePost;
