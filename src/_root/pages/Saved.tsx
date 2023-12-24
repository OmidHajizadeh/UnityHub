import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/hooks/react-query/queriesAndMutaions";
import { Models } from "appwrite";
import { Helmet } from "react-helmet";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.saved
    .map((savePost: Models.Document) => ({
      creator: {
        imageUrl: currentUser.imageUrl,
      },
      imageUrl: savePost.imageUrl,
      $id: savePost.$id,
    }))
    .reverse();

  return (
    <div className="saved-container">
      <Helmet>
        <title>پست های ذخیره شده</title>
      </Helmet>
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold w-full">پست های ذخیره شده</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : savePosts.length === 0 ? (
        <p className="text-light-4">پستی ذخیره نکرده اید</p>
      ) : (
        <GridPostList posts={savePosts} showStats={false} />
      )}
    </div>
  );
};

export default Saved;
