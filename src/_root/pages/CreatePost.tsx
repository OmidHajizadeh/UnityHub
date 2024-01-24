import { Helmet } from "react-helmet";

import AddIcon from "/icons/add-post.svg";
import PostForm from "@/components/forms/Post.form";

const CreatePost = () => {
  return (
    <>
      <Helmet>
        <title>افزودن پست جدید</title>
      </Helmet>
      <div className="flex flex-1">
        <div className="common-container">
          <div className="max-w-5xl hidden md:flex-start gap-3 justify-start w-full">
            <img
              src={AddIcon}
              alt="add"
              width={36}
              height={36}
              className="invert-white"
            />
            <h2 className="h2-bold w-full">ایجاد پست جدید</h2>
          </div>
          <PostForm action="create" />
        </div>
      </div>
    </>
  );
};

export default CreatePost;
